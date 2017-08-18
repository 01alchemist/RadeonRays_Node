export enum RenderingMode {
    WEBGL,
    CANVAS_2D,
    WEBRTC,
    UNKNOWN,
}
export class ViewPort {
    get mode(): RenderingMode {
        if (this.context instanceof WebGLRenderingContext) {
            return RenderingMode.WEBGL
        } else if (this.context instanceof WebGLRenderingContext) {
            return RenderingMode.CANVAS_2D
        } else {
            return RenderingMode.UNKNOWN
        }
    }
    public canvas: HTMLCanvasElement
    public context: WebGLRenderingContext | CanvasRenderingContext2D
    public mediaSource: MediaSource
    public video: HTMLVideoElement
    constructor(
        name: string,
        width?: number,
        height?: number,
        mode: RenderingMode = RenderingMode.WEBGL,
    ) {
        if (mode === RenderingMode.WEBRTC) {
            this.mediaSource = new MediaSource()
            this.video = document.createElement("video")
            this.mediaSource.addEventListener(
                "sourceopen",
                function(e) {
                    var sourceBuffer = this.mediaSource.addSourceBuffer(
                        'video/webm; codecs="vorbis,vp8"',
                    )
                    sourceBuffer.appendBuffer(oneVideoWebMChunk)
                },
                false,
            )
        } else {
            this.canvas = document.createElement("canvas")
            this.canvas.width = width || window.innerWidth
            this.canvas.height = height || window.innerHeight
            this.context = this.canvas.getContext(
                mode === RenderingMode.WEBGL ? "webgl" : "2d",
            )
        }
    }
}
