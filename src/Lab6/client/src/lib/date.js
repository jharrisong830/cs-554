/**
 * date handling functions (since we decide to use inconsistent date formats!)
 */

/**
 * translates a fake date into a real date
 * @param {string} fakeDate mm/dd/yyyy
 * @returns {string} yyyy-mm-dd
 */
export const toRealDate = (fakeDate) => {
    const [month, day, year] = fakeDate.split("/");
    return `${year}-${month}-${day}`;
};

/**
 * translates a real date into a fake date
 * @param {string} realDate yyyy-mm-dd
 * @returns {string} mm/dd/yyyy
 */
export const toFakeDate = (realDate) => {
    const [year, month, day] = realDate.split("-");
    return `${month}/${day}/${year}`;
};
