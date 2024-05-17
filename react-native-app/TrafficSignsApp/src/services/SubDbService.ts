import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { SubEntity } from '../entities/SubEntity';

export default class SubDbService {
    constructor() {}

    // CHANGE DB NAME
    db = SQLite.openDatabase('medicaldatabase.db');

    public dropSubTable() {
        this.db.transaction(tx => {
            tx.executeSql(
                'DROP TABLE IF EXISTS subEntities'
            );
        });
    }

    // !! HERE CHANGE FIELDS
    // ATTENTION AT RESERVED WORDS !!!!! FROM, TO, GROUP...

    public createSubTable() {
        this.db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS subEntities (id INTEGER PRIMARY KEY, name TEXT, supplier TEXT, type TEXT)',  
            );
        });
    }

    public deleteAllFromSubTable() {
        this.db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM subEntities'
            );
        });
    }

    // !! HERE CHANGE FIELDS

    public getSubEntities() {
        return new Promise<SubEntity[]>((resolve, reject) => 
            {this.db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM subEntities',
                    [],
                    (_, { rows }) => {
                        const subEnt = [];
                        for (let i = 0; i < rows.length; i++) {
                            subEnt.push(new SubEntity(rows.item(i).id, rows.item(i).name, rows.item(i).supplier, rows.item(i).type));
                        }
                        console.log('SubEntities: ', subEnt);
                        resolve(subEnt);
                    },
                    (txObj, error) => { 
                        console.log('Error fetching subEntities from DB: ', error);
                        Alert.alert("Data Persistence Error", "Fetching data error!");
                        reject(error);
                        return false; 
                    }
                );
        })});
    }

    // !! HERE CHANGE FIELDS

    public addSubEntity(entity: SubEntity) {
        this.db.transaction(tx => { 
            tx.executeSql(
                'INSERT INTO subEntities (id, name, supplier, type) VALUES (?, ?, ?, ?)', 
                [entity.id, entity.name, entity.supplier, entity.type],
                (txObj, resultSet) => {
                    console.log('Inserted subEntity: ', resultSet, new Date().getTime());
                    return true;
                },
                (txObj, error) => { 
                  console.log('Error inserting subEntities: ', error);
                  Alert.alert("Data Persistence Error", `Insert Object error! ${error} ${JSON.stringify(entity)} ${new Date().getTime()}`);
                  return false; 
                }     
            );
        });  
    }
    
    public deleteSubEntity(id: number) {
        this.db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM subEntities WHERE id=?', [id],
                (txObj, resultSet) => {
                    console.log('Deleted subEntity: ', resultSet);
                    return true;
                },
                (txObj, error) => { 
                    console.log('Error deleting subEntity: ', error);
                    Alert.alert("Data Persistence Error", "Delete Object error!");
                    return false; 
                }
            );
        });
    }

    // !! HERE CHANGE FIELDS

    // public updateSubEntity(entity: SubEntity) {
    //     this.db.transaction(tx => {
    //         tx.executeSql(
    //             'UPDATE subEntities SET name=? WHERE id=?', [entity.name, entity.id],
    //             (txbObj, resultSet) => {
    //                 console.log('Updated subEntity: ', resultSet);
    //                 return true;
    //             },
    //             (txObj, error) => { 
    //                 console.log('Error updating subEntity: ', error);
    //                 Alert.alert("Data Persistence Error", "Update Object error!");
    //                 return false; 
    //             }
    //         );
    //     });
    // }
}