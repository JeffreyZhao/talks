namespace FSharp

open System

type Async() =
    static member Transfer(urlIn, urlOut, onProgress: Action<double>, onComplete: Action<int>, onError: Action<Exception>) =
        Async.StartWithContinuations(
            AsyncTransfer.transfer urlIn urlOut (fun p -> onProgress.Invoke(p)),
            (fun l -> onComplete.Invoke(l)),
            (fun ex -> onError.Invoke(ex)),
            (fun ocex -> ocex |> ignore))