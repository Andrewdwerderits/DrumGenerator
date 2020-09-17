
class RandomizerEngine {
    // Main entry point All configurations should be passed in here
    public static getRandomCollectionWithConstraint<T>(items: Array<T>,
                                                       constraints: (arraySoFar: Array<T>) => boolean,
                                                       termination: (arraySoFar: Array<T>) => boolean) {
        const result: T[] = [];
        while (!termination(result)) {
            let newItem = getRandomItemSelection(items);
            if (constraints([...result, newItem])) {
                result.push(newItem);
            }
        }
        return result;
    }

    public static addRandomPropertyToRandomCollection<T, G>(previousItems: T[], itemsToAdd: G[],
                                                            constraints: (arraySoFar: T[]) => boolean,
                                                            insertion: (previousItem: T, newItem: G) => T) {

        const result: T[] = [];

        previousItems.forEach((item) => {
            let added = false;
            while (!added) {
                const randomItem = getRandomItemSelection(itemsToAdd);
                const newItem = insertion(item, randomItem);
                if (constraints([...result, newItem])) {
                    result.push(newItem);
                    added = true;
                }
            }

        });
        return result;
    }

    public static shuffleArray<T>(inputArray: T[], shouldIgnore: (item: T) => boolean): void {
        for (let i = inputArray.length - 1; i > 0; i--) {
            if (shouldIgnore(inputArray[i])) {
                continue;
            }
            let j = Math.floor(Math.random() * (i + 1));
            if (shouldIgnore(inputArray[j])) {
                continue;
            }
            [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]];
        }
    }
    
    public static randomNumberInRange (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

const getRandomItemSelection = (items: Array<any>) => {
    return items[Math.floor(Math.random() * items.length)];
};

export default RandomizerEngine;