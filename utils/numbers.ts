export const numberWithCommas = (x: number | undefined) => {
    if (!x) return 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatThousands = (x: number | undefined) => {
    if (!x) return 0;
    else if (x < 1000) return x;

    return `${(x / 1000).toFixed(0)}k`;
};
