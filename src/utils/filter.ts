
export default {
    /**
     * 处理数字过千处理
     * @param val 
     * @returns 
     */
    formatNum(val: number) {
        if (val >= 1000) {
            return `${Math.ceil(val / 1000)}k`;
        }
        return val;
    }
}