export class SubEntity {
    public id: number;
    public name: string;
    public supplier: string;
    public type: string;

    constructor(id: number, name: string, supplier: string, type: string) {
        this.id = id;
        this.name = name;
        this.supplier = supplier;
        this.type = type;
    }
}