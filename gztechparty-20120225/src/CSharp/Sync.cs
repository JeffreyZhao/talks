using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;

namespace CSharp
{
    public static class Sync
    {
        public static void Transfer(
            string urlIn,
            string urlOut,
            Action<double> onProgress,
            Action<int> onComplete)
        {
            onProgress(0);

            var requestIn = WebRequest.Create(urlIn);

            using (var responseIn = requestIn.GetResponse())
            {
                var streamIn = responseIn.GetResponseStream();

                var requestOut = WebRequest.Create(urlOut);
                requestOut.Method = "POST";

                var totalLength = (int)responseIn.ContentLength;

                using (var streamOut = requestOut.GetRequestStream())
                {
                    var totalRead = 0;
                    var buffer = new byte[10240];

                    while (totalRead < totalLength)
                    {
                        var lengthRead = streamIn.Read(buffer, 0, buffer.Length);
                        streamOut.Write(buffer, 0, lengthRead);

                        totalRead += lengthRead;
                        onProgress(100.0 * totalRead / totalLength);
                    }
                }

                onComplete(totalLength);
            }
        }
    }
}
