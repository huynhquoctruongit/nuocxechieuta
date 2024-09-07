import dayjs from "dayjs"
export const formattedAmount = (amount) => {
    if (amount) {
        const format = parseFloat(amount.toString())
        return format == 0 ? "" : format
    }

}
export function isNumber(value) {
    value = value * 1
    return typeof value === 'number' && !isNaN(value);
}
export const totalRice = (data) => {
    if (!data) return
    return data.reduce((total, food) => {
        const foodTotal = food.items
            .filter(item => item.name !== "orther-food")
            .reduce((sum, item) => sum + item.price * 1, 0);

        return total + foodTotal;
    }, 0);
}
export const totalWater = (data) => {
    if (!data) return
    return data.reduce((total, food) => {
        const foodTotal = food.items
            .filter(item => item.name === "orther-food")
            .reduce((sum, item) => sum + item.price * 1, 0);

        return total + foodTotal;
    }, 0);
}
export function getStartAndEndOfLastWeek() {
    const today = dayjs();
    const startOfThisWeek = today.startOf('isoWeek');
    const startOfLastWeek = startOfThisWeek.subtract(1, 'week');
    const endOfLastWeek = startOfLastWeek.endOf('isoWeek');
    return {
        startOfLastWeek: startOfLastWeek.format('YYYY-MM-DD'),
        endOfLastWeek: endOfLastWeek.format('YYYY-MM-DD'),
    };
}