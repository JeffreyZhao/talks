using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;

namespace CSharp
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
            WebRequest requestIn = null;
            WebResponse responseIn = null;
            Stream streamIn = null;

            WebRequest requestOut = null;
            Stream streamOut = null;

            AsyncCallback endGetResponseIn = null;
            AsyncCallback endGetRequestStreamOut = null;
            AsyncCallback endReadStreamIn = null;
            AsyncCallback endWriteStreamOut = null;

            byte[] buffer = null;
            int totalRead = 0, totalLength = 0, lengthRead = 0;

            endGetResponseIn = (ar) =>
            {
                try
                {
                    responseIn = requestIn.EndGetResponse(ar);
                }
                catch (Exception ex)
                {
                    onError(ex);
                    return;
                }

                streamIn = responseIn.GetResponseStream();

                requestOut = HttpWebRequest.Create(urlOut);
                requestOut.Method = "POST";
                requestOut.BeginGetRequestStream(endGetRequestStreamOut, null);
            };

            endGetRequestStreamOut = (ar) =>
            {
                try
                {
                    streamOut = requestOut.EndGetRequestStream(ar);
                }
                catch (Exception ex)
                {
                    responseIn.Close();

                    onError(ex);
                    return;
                }

                totalLength = (int)responseIn.ContentLength;
                buffer = new byte[10240];
                streamIn.BeginRead(buffer, 0, buffer.Length, endReadStreamIn, null);
            };

            endReadStreamIn = (ar) =>
            {
                try
                {
                    lengthRead = streamIn.EndRead(ar);
                }
                catch (Exception ex)
                {
                    streamOut.Close();
                    responseIn.Close();

                    onError(ex);
                    return;
                }

                streamOut.BeginWrite(buffer, 0, lengthRead, endWriteStreamOut, null);
            };

            endWriteStreamOut = (ar) =>
            {
                try
                {
                    streamOut.EndWrite(ar);
                }
                catch (Exception ex)
                {
                    streamOut.Close();
                    responseIn.Close();

                    onError(ex);
                    return;
                }

                totalRead += lengthRead;
                onProgress(100.0 * totalRead / totalLength);

                if (totalRead < totalLength)
                {
                    streamIn.BeginRead(buffer, 0, buffer.Length, endReadStreamIn, null);
                }
                else
                {
                    streamOut.Close();
                    responseIn.Close();

                    onComplete(totalLength);
                }
            };

            onProgress(0);

            requestIn = WebRequest.Create(urlIn);
            requestIn.BeginGetResponse(endGetResponseIn, null);
        }
    }
}
