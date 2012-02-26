using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Wintellect.Threading.AsyncProgModel;

namespace CSharp2
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
            var ae = new AsyncEnumerator();
            ae.BeginExecute(GetAsyncEnumerator(ae, urlIn, urlOut, onProgress, onComplete), ar =>
            {
                try
                {
                    ae.EndExecute(ar);
                }
                catch (Exception ex)
                {
                    onError(ex);
                }
            });
        }

        private static IEnumerator<int> GetAsyncEnumerator(
            AsyncEnumerator ae,
            string urlIn,
            string urlOut,
            Action<double> onProgress,
            Action<int> onComplete)
        {
            onProgress(0);

            var requestIn = WebRequest.Create(urlIn);
            requestIn.BeginGetResponse(ae.End(), null);
            yield return 1;

            using (var responseIn = requestIn.EndGetResponse(ae.DequeueAsyncResult()))
            {
                var streamIn = responseIn.GetResponseStream();

                var requestOut = WebRequest.Create(urlOut);
                requestOut.Method = "POST";

                var totalLength = (int)responseIn.ContentLength;

                requestOut.BeginGetRequestStream(ae.End(), null);
                yield return 1;

                using (var streamOut = requestOut.EndGetRequestStream(ae.DequeueAsyncResult()))
                {
                    var totalRead = 0;
                    var buffer = new byte[10240];

                    while (totalRead < totalLength)
                    {
                        streamIn.BeginRead(buffer, 0, buffer.Length, ae.End(), null);
                        yield return 1;
                        var lengthRead = streamIn.EndRead(ae.DequeueAsyncResult());

                        streamOut.BeginWrite(buffer, 0, lengthRead, ae.End(), null);
                        yield return 1;
                        streamOut.EndWrite(ae.DequeueAsyncResult());

                        totalRead += lengthRead;
                        onProgress(100.0 * totalRead / totalLength);
                    }
                }

                onComplete(totalLength);
            }
        }
    }
}
