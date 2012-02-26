using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CSharp5
{
    public static class Async
    {
        public static void Transfer(
            string urlIn,
            string urlOut,
            Action<double> onProgress,
            Action<int> onComplete,
            Action<Exception> onError)
        {
            TransferAsync(urlIn, urlOut, onProgress, onComplete, onError);
        }

        private static async Task TransferAsync(
            string urlIn,
            string urlOut,
            Action<double> onProgress,
            Action<int> onComplete,
            Action<Exception> onError)
        {
            try
            {
                var lengthRead = await TransferAsync(urlIn, urlOut, onProgress);
                onComplete(lengthRead);
            }
            catch (Exception ex)
            {
                onError(ex);
            }
        }

        private static async Task<int> TransferAsync(
            string urlIn,
            string urlOut,
            Action<double> onProgress)
        {
            onProgress(0);

            var requestIn = WebRequest.Create(urlIn);

            using (var responseIn = await requestIn.GetResponseAsync())
            {
                var streamIn = responseIn.GetResponseStream();

                var requestOut = WebRequest.Create(urlOut);
                requestOut.Method = "POST";

                var totalLength = (int)responseIn.ContentLength;

                using (var streamOut = await requestOut.GetRequestStreamAsync())
                {
                    var totalRead = 0;
                    var buffer = new byte[10240];

                    while (totalRead < totalLength)
                    {
                        var lengthRead = await streamIn.ReadAsync(buffer, 0, buffer.Length);
                        await streamOut.WriteAsync(buffer, 0, lengthRead);

                        totalRead += lengthRead;
                        onProgress(100.0 * totalRead / totalLength);
                    }
                }

                return totalLength;
            }
        }
    }
}
