module AsyncTransfer

open System
open System.Net
open System.IO

type WebRequest with
    member r.AsyncGetRequestStream() =
        Async.FromBeginEnd(r.BeginGetRequestStream, r.EndGetRequestStream)

let transfer (urlIn: string) (urlOut: string) onProgress = async {
    
    let requestIn = WebRequest.Create(urlIn);
    use! responseIn = requestIn.AsyncGetResponse()
    let streamIn = responseIn.GetResponseStream()
    
    let requestOut = WebRequest.Create(urlOut)
    requestOut.Method <- "POST"
    use! streamOut = requestOut.AsyncGetRequestStream()
    
    let totalLength = (int)responseIn.ContentLength
    let buffer = Array.zeroCreate<byte> 10240
    
    let rec loop totalRead = async {
        onProgress (100.0 * (double)totalRead / (double)totalLength)

        if totalRead < totalLength then
            let! lengthRead = streamIn.AsyncRead(buffer, 0, buffer.Length)
            do! streamOut.AsyncWrite(buffer, 0, lengthRead)
            return! loop (totalRead + lengthRead)
        else 
           return totalLength
    }

    return! loop 0;
}