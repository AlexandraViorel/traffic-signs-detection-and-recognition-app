import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { Entity } from '../entities/Entity';

export default class FullDbService {
    constructor() {}

    // CHANGE DB NAME
    db = SQLite.openDatabase('medicaldatabase.db');

    public dropFullTable() {
        this.db.transaction(tx => {
            tx.executeSql(
                'DROP TABLE IF EXISTS entities'
            );
        });
    }

    // !! HERE CHANGE FIELDS
    // ATTENTION AT quantity WORDS !!!!! FROM, TO, GROUP...
    
    public createFullTable() {
        this.db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS entities (id INTEGER PRIMARY KEY, name TEXT, supplier TEXT, details TEXT, status TEXT, quantity INTEGER, type TEXT)',   
            );
        });
    }

    public deleteAllFromFullTable() {
        this.db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM entities'
            );
        });
    }

    // !! HERE CHANGE FIELDS

    public getEntities() {
        return new Promise<Entity[]>((resolve, reject) => 
            this.db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM entities',
                    [],
                    (_, { rows }) => {
                        const ent = [];
                        for (let i = 0; i < rows.length; i++) {
                            ent.push(new Entity(rows.item(i).id, rows.item(i).name, rows.item(i).supplier, rows.item(i).details, rows.item(i).status, rows.item(i).quantity, rows.item(i).type));
                        }
                        resolve(ent);
                    },
                    (txObj, error) => { 
                        console.log('Error fetching entities from DB: ', error);
                        Alert.alert("Data Persistence Error", "Fetching data error!");
                        reject(error);
                        return false; 
                    }
                );
            }));
    }

    // !! HERE CHANGE FIELDS
    // THIS IS FOR WHEN WE HAVE IN THE FIRST LIST ONLY CATEGORIES AND THEN ON DETAILS WE WANNA SEE A LIST OF FULL ENTITIES

    // public getFullEntitiesByCategory(field: string) {
    //     return new Promise<any>((resolve, reject) => 
    //         this.db.transaction(tx => {
    //             tx.executeSql(
    //                 'SELECT * FROM entities where date=?',[field],
    //                 (_, { rows }) => {
    //                     const ent = [];
    //                     for (let i = 0; i < rows.length; i++) {
    //                         ent.push(new Entity(rows.item(i).id, rows.item(i).date, rows.item(i).symptom, rows.item(i).medication, rows.item(i).dosage, rows.item(i).doctor, rows.item(i).notes));
    //                     }
    //                     resolve(ent);
    //                 },
    //                 (txObj, error) => { 
    //                     console.log('Error fetching entities from DB: ', error);
    //                     Alert.alert("Data Persistence Error", "Fetching data error!");
    //                     reject(error);
    //                     return false; 
    //                 }
    //             );
    //         }));
    // }

    // !! HERE CHANGE FIELDS

    // public getEntity(id: number) {
    //     return new Promise<Entity>((resolve, reject) => 
    //         this.db.transaction(tx => {
    //             tx.executeSql(
    //                 'SELECT * FROM entities WHERE id=?',
    //                 [id],
    //                 (_, { rows }) => {
    //                     const ent = [];
    //                     for (let i = 0; i < rows.length; i++) {
    //                         ent.push(new Entity(rows.item(i).id, rows.item(i).name, rows.item(i).breed, rows.item(i).age, rows.item(i).weight, rows.item(i).owner, rows.item(i).location, rows.item(i).description));
    //                     }
    //                     resolve(ent[0]);
    //                 },
    //                 (txObj, error) => { 
    //                     console.log('Error fetching entity from DB: ', error);
    //                     Alert.alert("Data Persistence Error", "Fetching data error!");
    //                     reject(error);
    //                     return false; 
    //                 }
    //             );
    //         }));
    // }

    // !! HERE CHANGE FIELDS 

    public addEntity(entity: Entity) {
        this.db.transaction(tx => { 
            tx.executeSql(
                'INSERT INTO entities (id, name, supplier, details, status, quantity) VALUES (?, ?, ?, ?, ?, ?)', 
                [entity.id, entity.name, entity.supplier, entity.details, entity.status, entity.quantity],
                (txObj, resultSet) => {
                    console.log('Inserted entity: ', resultSet, new Date().getTime());
                    return true;
                },
                (txObj, error) => { 
                  console.log('Error inserting entities: ', error, entity);
                  Alert.alert("Data Persistence Error", `Insert Object error! ${error} ${JSON.stringify(entity)} ${new Date().getTime()}`);
                  return false; 
                }     
                );
        });  
    }

    // public deleteEntity(id: number) {
    //     this.db.transaction(tx => {
    //         tx.executeSql(
    //             'DELETE FROM entities WHERE id=?', [id],
    //             (txObj, resultSet) => {
    //                 console.log('Deleted entity: ', resultSet);
    //                 return true;
    //             },
    //             (txObj, error) => { 
    //                 console.log('Error deleting entity: ', error);
    //                 Alert.alert("Data Persistence Error", "Delete Object error!");
    //                 return false; 
    //             }
    //         );
    //     });
    // }

    // !! HERE CHANGE FIELDS

    // public updateEntity(entity: Entity) {
    //     this.db.transaction(tx => {
    //         tx.executeSql(
    //             'UPDATE entities SET name=?, breed=?, age=?, weight=?, owner=?, location=?, description=? WHERE id=?', [entity.name, entity.breed, entity.age, entity.weight, entity.owner, entity.location, entity.description, entity.id],
    //             (txObj, resultSet) => {
    //                 console.log('Updated entity: ', resultSet);
    //                 return true;
    //             },
    //             (txObj, error) => { 
    //                 console.log('Error updating entity: ', error);
    //                 Alert.alert("Data Persistence Error", "Update Object error!");
    //                 return false; 
    //             }
    //         );
    //     });
    // }

    public getEntitiesMinId() {
        return new Promise<number>((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(
                'SELECT MIN(id) AS minId FROM entities',
                [],
                (txObj, resultSet) => {
                    const minId = resultSet.rows.item(0).minId;
                    resolve(minId);
                },
                (txObj, error) => {
                    reject(error);
                    return false;
                });
            });
        });
    }
}