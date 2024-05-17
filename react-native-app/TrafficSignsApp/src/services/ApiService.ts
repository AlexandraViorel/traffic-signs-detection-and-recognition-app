import { ip } from "../constants";
import { Entity } from "../entities/Entity";
import { SubEntity } from "../entities/SubEntity";

// !! HERE CHANGE THE PATHS

export default class ApiService {
    private apiBase: string = `http://${ip}/`;
    constructor() {}

    public getSubEntities() {
        return fetch(this.apiBase + "medicalsupplies")
            .then((response) => response.json())
            .then((data) => data);
    }

    public getEntities() {
        return fetch(this.apiBase + "medicalsupplies")
            .then((response) => response.json())
            .then((data) => data);
    }

    public getFullEntitiesByCategory(date: string) {
        return fetch(this.apiBase + "symptoms/" + date)
            .then((response) => response.json())
            .then((data) => data);
    }

    public getOrders() {
        return fetch(this.apiBase + "supplyorders")
            .then((response) => response.json())
            .then((data) => data);
    }

    public getTypes() {
        return fetch(this.apiBase + "suppliestypes")
            .then((response) => response.json())
            .then((data) => data);
    }

    public changeFieldRequest(type: string) {
        return fetch(this.apiBase + "requestsupply/" + type, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"type": type}),
        })
            .then((response) => response.json())
            .then((data) => data);
    }

    public changeFieldBorrow(entity: SubEntity) {
        return fetch(this.apiBase + "borrow/" + entity.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entity),
        })
            .then((response) => response.json())
            .then((data) => data);
    }

    public addEntity(entity: Entity) {
        return fetch(this.apiBase + "medicalsupply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entity),
        })
            .then((response) => response.json())
            .then((data) => data);
    }

    public deleteEntity(id: number) {
        return fetch(this.apiBase + "space/" + id, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => data);
    }

    public updateEntity(entity: Entity) {
        return fetch(this.apiBase + "pet", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entity),
        })
            .then((response) => response.json())
            .then((data) => data);
    }

    public detailsEntity(id: number) {
        return fetch(this.apiBase + "medicalsupply/" + id)
            .then((response) => response.json())
            .then((data) => data);
    }

    public getForSearch() {
        return fetch(this.apiBase + "search")
            .then((response) => response.json())
            .then((data) => data);
    }

    public getCertainCategory() {
        return fetch(this.apiBase + "free")
            .then((response) => response.json())
            .then((data) => data);
    }
}