
const handleTinNumber = (str: string) => {
    let dive = 3;
    let arr = [];
    for (let x = 1; x <= Math.ceil(str.length / dive); x++) {
        const start = (x - 1) * dive;
        const end = x * dive;
        const spliceStr = str.slice(start, end);
        arr.push(spliceStr);
    }
    return arr.join('-');
}

export default handleTinNumber