type path = string | number;
class JSONPath {
    /**
     * The static method `hasPath()` returns a boolean value indicating whether the `paths` exists in the `obj`.
     * @param obj The object to be checked.
     * @param paths Check the `obj` with the `paths`.
     * @returns {boolean} A boolean value indicating whether the `paths` exists in the `obj`.
     */
    public static hasPath(obj: object, paths: path[] | path): boolean {
        try {
            if (typeof paths !== "object") return obj.hasOwnProperty(paths);
            let thisObj: any = obj;
            for (const path of paths) {
                thisObj = thisObj[path];
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * The static method `getPath()` returns the value of the `paths` in the `obj`.
     * @param obj The object to be got.
     * @param paths The value of the `paths` in the `obj`.
     * @returns The value of the `paths` in the `obj`.
     */
    public static getPath(obj: object, paths: path[] | path): unknown {
        if (!JSONPath.hasPath(obj, paths)) return null;
        if (typeof paths !== "object") return (<any>obj)[paths];
        let thisObj: any = obj;
        for (const path of paths) {
            thisObj = thisObj[path];
        }
        return thisObj;
    }

    /**
     * The static method `setPath()` sets the `paths` in the `obj` to the `value`.
     * @param obj The object to be set.
     * @param paths The path to set object.
     * @param value The value to set.
     * @detail If the path does not exist, it will be automatically filled in.
     */
    public static setPath(obj: object, paths: path[], value: any): void {
        let thisObj: any = obj;
        const key: path = <path>paths.at(-1);

        for (let i: number = 0; i < paths.length-1; i++) {
            const path: path = paths[i];

            if (!thisObj[path]) {
                const nextPath: path = paths[i+1]
                if (typeof nextPath === "string") thisObj[path] = {};
                else thisObj[path] = [];
            }

            thisObj = thisObj[path];
        }

        thisObj[key] = value;
    }

    public static completeObject(broken: unknown, completion: unknown, paths: path[] = []): unknown {
        const isRecord = (value: unknown): boolean => typeof value === "object" && value !== null && !(value instanceof Array);
        const pathIs = (startWith: string) => typeof paths.at(-1) === "string" && (<string>paths.at(-1)).startsWith(startWith)
        /*console.log(paths);*/
        if (pathIs("!!")/* 以!!开头直接以completion替换broken */) {
            return completion ?? broken;
        } else if (pathIs("--")/* 以--开头直接以broken替换completion */) {
            return broken ?? completion;
        }

        if (broken instanceof Array && completion instanceof Array) {
            /* 两个列表 */
            const result: any[] = [];
            let arrayLength: number = 0;
            if (pathIs("**")) /* 父键以**开头为自由长度 */ arrayLength = Math.max(broken.length, completion.length);
            else arrayLength = completion.length;

            const thePaths: path[] = paths;
            const lastIndex: number = thePaths.length;
            for (let i: number = 0; i < arrayLength; i++) {
                thePaths[lastIndex] = i;
                const completeValue = JSONPath.getPath(completion, i);
                const brokenValue = JSONPath.getPath(broken, i);
                result[i] = JSONPath.completeObject(brokenValue, completeValue, thePaths);
            }
            thePaths.pop();

            return result;
        } else if (isRecord(broken) && isRecord(completion)) {
            /* 两个键值对 */
            const result: {[key: string]: any} = {};
            const thePaths: path[] = paths;
            const lastIndex: number = thePaths.length;
            const completeKeys: string[] = Object.keys(<object>completion);

            for (let i: number = 0; i < completeKeys.length; i++) {
                thePaths[lastIndex] = completeKeys[i];
                const completeValue = JSONPath.getPath(<object>completion, completeKeys[i]);
                const brokenValue = JSONPath.getPath(<object>broken, completeKeys[i]);
                result[completeKeys[i]] = JSONPath.completeObject(brokenValue, completeValue, thePaths);
            }
            thePaths.pop();

            return result;
        } else {
            /* 类型不相同或都是字面量 */
            return broken ?? completion;
        }
    }
}


export default JSONPath;