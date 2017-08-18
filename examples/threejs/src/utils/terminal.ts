import {isNode} from "./env";
import {Color, HexColor} from "./color";
/**
 * Created by n.vinayakan on 06.06.17.
 */
export class Terminal {

    static silent: boolean = false;
    static history: string = "";
    static browserStyles = {
        text: HexColor[Color.DEFAULT_TEXT],
        background: HexColor[Color.DEFAULT_BG],
        bold: false
    };
    static browserBuffer = [];

    static log(text) {
        Terminal.write(text + "\n");
    }

    static write(text) {
        Terminal.history += text;
        if (Terminal.silent) {
            return;
        }
        if (isNode) {
            process.stdout.write(text);
        } else {
            if (text === "\n") {
                let texts = [];
                let styles = [];
                Terminal.browserBuffer.forEach(log => {
                    texts.push(log.text);
                    styles.push(log.style);
                });
                console.log.apply(null, [texts.join("")].concat(styles) );
                Terminal.browserBuffer = [];
            } else {
                Terminal.browserBuffer.push({
                    text: `%c${text}`,
                    style: `background: ${Terminal.browserStyles.background};` +
                    `color: ${Terminal.browserStyles.text};` +
                    `font-weight: ${Terminal.browserStyles.bold ? "700" : "100"};`
                })
            }
        }
    }

    static time(name: string) {
        if (!Terminal.silent) {
            console.time(name);
        }
    }

    static timeEnd(name: string) {
        if (!Terminal.silent) {
            console.timeEnd(name);
        }
    }

    static setBGColor(color) {
        if (isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[48;5;${color === null ? "" : color}m`);
            }
        } else {
            Terminal.browserStyles.background = HexColor[color];
        }
    }

    static setTextColor(color) {
        if (isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[38;5;${color}m`);
            }
        } else {
            Terminal.browserStyles.text = HexColor[color];
        }
    }

    static setBoldText() {
        if (isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[38;1m`);
            }
        } else {
            Terminal.browserStyles.bold = true;
        }
    }

    static clearColor() {
        if (isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[0m`);
            }
        } else {
            Terminal.browserStyles.text = HexColor[Color.DEFAULT_TEXT];
            Terminal.browserStyles.background = "none";
            Terminal.browserStyles.bold = false;
        }
    }

    static error(content: Error | string) {
        Terminal.setBGColor(Color.RED);
        Terminal.setTextColor(Color.WHITE);
        Terminal.write(" ERROR ");
        Terminal.clearColor();
        Terminal.setTextColor(Color.RED);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }

    static warn(content: any) {
        Terminal.setBGColor(Color.ORANGE);
        Terminal.setTextColor(Color.WHITE);
        Terminal.write(" WARNING ");
        Terminal.clearColor();
        Terminal.setTextColor(Color.ORANGE);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }

    static success(content: any) {
        Terminal.setBGColor(Color.GREEN);
        Terminal.setTextColor(Color.WHITE);
        Terminal.write(" SUCCESS ");
        Terminal.clearColor();
        Terminal.setTextColor(Color.GREEN);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }

    static info(content: any) {
        Terminal.setBGColor(Color.BLUE);
        Terminal.setTextColor(Color.WHITE);
        Terminal.write(" INFO ");
        Terminal.clearColor();
        Terminal.setTextColor(Color.BLUE);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }
}
