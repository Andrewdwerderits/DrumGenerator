
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
        
        previousItems.map((item) => {
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
    
}
const getRandomItemSelection = (items: Array<any>) => {
    return items[Math.floor(Math.random() * items.length)];
};

export default RandomizerEngine;