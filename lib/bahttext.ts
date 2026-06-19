
/**
 * Converts a number to Thai Baht text format
 * Example: 121.50 -> หนึ่งร้อยยี่สิบเอ็ดบาทห้าสิบสตางค์
 */
export function bahtText(num: number): string {
    if (!num && num !== 0) return ""
    if (num === 0) return "ศูนย์บาทถ้วน"

    const txtNumArr = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"]
    const txtDigitArr = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"]

    let bahtText = ""
    let numStr = num.toFixed(2)
    let [intStr, decStr] = numStr.split(".")

    // Process Integer Part
    if (Number(intStr) > 0) {
        const len = intStr.length
        for (let i = 0; i < len; i++) {
            const n = Number(intStr[i])
            const digit = len - i - 1

            if (n !== 0) {
                if (digit % 6 === 1 && n === 2) {
                    bahtText += "ยี่"
                } else if (digit % 6 === 1 && n === 1) {
                    bahtText += ""
                } else if (digit % 6 === 0 && n === 1 && len > 1 && i !== 0) { // Fix for 101, 201 etc. but careful with 11
                    // Logic for 'Et' (1): 
                    // It applies to position 0 (Ones) if number > 9.
                    if (i === len - 1 && len > 1) bahtText += "เอ็ด"
                    // Also applies to millions if prior digits exist? "101 ล้าน" -> หนึ่งร้อยเอ็ดล้าน
                    else if (digit % 6 === 0 && len > digit + 1 && i > 0) bahtText += "เอ็ด"
                    else bahtText += txtNumArr[n]
                } else {
                    bahtText += txtNumArr[n]
                }

                bahtText += txtDigitArr[digit % 6]
            }

            // Handle Million
            if (digit % 6 === 0 && digit > 0) {
                bahtText += "ล้าน"
            }
        }
        bahtText += "บาท"
    }

    // Process Decimal Part
    if (Number(decStr) > 0) {
        if (decStr.length === 2) {
            const n1 = Number(decStr[0])
            const n2 = Number(decStr[1])

            if (n1 !== 0) {
                if (n1 === 2) bahtText += "ยี่"
                else if (n1 === 1) bahtText += ""
                else bahtText += txtNumArr[n1]
                bahtText += "สิบ"
            }

            if (n2 !== 0) {
                if (n2 === 1 && n1 !== 0) bahtText += "เอ็ด"
                else bahtText += txtNumArr[n2]
                bahtText += "สตางค์"
            } else {
                bahtText += "สตางค์" // 50 -> ห้าสิบสตางค์
            }
        }
    } else {
        bahtText += "ถ้วน"
    }

    return bahtText
}
