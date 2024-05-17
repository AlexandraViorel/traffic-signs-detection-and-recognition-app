export class Entity {
    public id: number;
    public name: string;
    public supplier: string;
    public details: string;
    public status: string;
    public quantity: number;
    public type: string;

    constructor(id: number, name: string, supplier: string, details: string, status: string, quantity: number, type: string) {
        this.id = id;
        this.name = name;
        this.supplier = supplier;
        this.details = details;
        this.status = status;
        this.quantity = quantity;
        this.type = type;
    }
}