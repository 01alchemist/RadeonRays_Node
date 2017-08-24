export default function assert(condition) {
    if (condition !== true) {
        debugger
        throw "Assertion failed"
    }
}
