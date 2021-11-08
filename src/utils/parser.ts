export function encode(tab: number[]): string {
    let result: string = "";

    tab.forEach(function(x) {
        result += x + ":";
    });
    result = result.slice(0, -1)

    return result;
}

export function decode(crypted: string): number[] {
    let result: number[] = [];
    let i = 0;
    const list: string[] = crypted.split(":");

    list.forEach(function(x) {
        result[i++] = parseInt(x);
    });
    
    return result;
}

export function removeElement(tab: string, id: number): string {
    let result: number[] = decode(tab);

    for (let i = 0; i < result.length; i++)
        if (result[i] === id)
            result.splice(i ,1);

    return encode(result);
}

export function addElement(tab: string, id: number): string {
    let result: number[] = decode(tab);

    result[result.length] = id;
    return encode(result);
}

export function isEmpty(value: string | number[]): boolean {
    if (typeof(value) == "object" &&  isNaN(value[0]))
        return true;
    else if (typeof(value) == "string" && value.length < 1)
        return true;
    else
        return false;
}

export function isIn(value: string | number[], id: number): boolean {
    if (isEmpty(value))
        return false;
    if (typeof(value) == "object" && value.length > decode(removeElement(encode(value), id)).length)
        return true;
    else if (typeof(value) == "string")
        return isIn(decode(value), id);
    return false;
}