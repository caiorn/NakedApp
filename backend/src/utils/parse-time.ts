export function parseExpirationToSeconds(exp : number | string) {
    if (typeof exp === "number") return exp;
    const match = /^(\d+)([smhd])$/.exec(exp);
    if (!match) throw new Error("Formato de expiração inválido: " + exp);
    const value = Number(match[1]);
    const unit = match[2];
    switch (unit) {
        case "s": return value;
        case "m": return value * 60;
        case "h": return value * 60 * 60;
        case "d": return value * 60 * 60 * 24;
        case "M": return value * 60 * 60 * 24 * 30;
        default: throw new Error("Unidade de expiração inválida: " + unit);
    }
}