import { createContext, useContext, useReducer, useState } from "react";
import ApiService from "./services/ApiService";
import { Entity } from "./entities/Entity";
import { Alert } from "react-native";
import { SubEntity } from "./entities/SubEntity";
import { deleteOffline, postOffline, putOffline } from "./constants";
import FullDbService from "./services/FullDbService";
import SubDbService from "./services/SubDbService";

interface serviceInterface {
    ApiService: ApiService,
    FullDbService: FullDbService,
    SubDbService: SubDbService,
}

interface ContextValues {
    entities: SubEntity[],
    getSubEntities: () => void,
    getEntities: () => Promise<Entity[]>,
    // getFullEntititesByCategory: (date: string) => Promise<Entity[]> ,
    getOrders: () => Promise<Entity[]>,
    getTypes: () => Promise<Entity[]>,
    addEntity: (entity: Entity) => void,
    // deleteEntity: (entity: Entity) => void,
    getCertainCategory: () => Promise<Entity[]>,
    // updateEntity: (entity: Entity) => void,
    detailsEntity: (entity: SubEntity) => Promise<Entity | undefined>,
    getForSearch: () => Promise<Entity[]>,
    changeFieldRequest: (type: string) => Promise<SubEntity>,
    changeFieldBorrowed: (entity: SubEntity) => Promise<SubEntity>,
    top: () => Promise<Entity[]>,
}

type State = {
    entities: SubEntity[],
}

type Action = 
    | { type: 'addEntity', payload: SubEntity }
    | { type: 'removeEntity', payload: SubEntity }
    | { type: 'updateEntity', payload: SubEntity }
    | { type: 'setEntities', payload: SubEntity[] }

const services: serviceInterface = {
    ApiService: new ApiService(),
    FullDbService: new FullDbService(),
    SubDbService: new SubDbService(),
}

const initialState: State = {
    entities: [],
}

const AppContext = createContext<ContextValues | undefined>(undefined);

const entityReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'addEntity':
            return {
                ...state,
                entities: [...state.entities, action.payload]
            }
        case 'removeEntity': 
            return {
                ...state,
                entities: state.entities.filter(entity => entity.id !== action.payload.id)
            }
        case 'updateEntity':
            return {
                ...state,
                entities: state.entities.map(entity => entity.id === action.payload.id ? action.payload : entity)
            }
        case 'setEntities':
            return {
                ...state,
                entities: [...action.payload]
            }
    }
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(entityReducer, initialState);

    const getSubEntities = async () => { 
        try {
            // services.FullDbService.dropFullTable();
            // services.SubDbService.dropSubTable();

            services.FullDbService.createFullTable();
            services.SubDbService.createSubTable();

            const response = await services.SubDbService.getSubEntities();
            if (response.length > 0) {
                dispatch({type: 'setEntities', payload: response});
                return;
            }


            const apiresponse = await services.ApiService.getSubEntities();
            apiresponse.forEach((entity: SubEntity) => {
                services.SubDbService.addSubEntity(entity);
            });

            const finalresponse = await services.SubDbService.getSubEntities();
            dispatch({type: 'setEntities', payload: finalresponse});

        }
        catch (error: any) {
            if (error.response?.status == 404) {
                Alert.alert('Invalid input', error.response.data.message);
                return;
            }

            Alert.alert('You are offline', 'Please check your internet connection');
        }
     }

    const getEntities = async () => {
        try{
            const response = await services.ApiService.getEntities();
            return response;

        } catch (error: any) {
            if (error.response?.status == 404) {
                Alert.alert('Invalid input', error.response.data.message);
                return;
            }

            Alert.alert('You are offline', 'Please check your internet connection');
        }
    }

    // THIS IS FOR WHEN WE HAVE IN THE FIRST LIST ONLY CATEGORIES AND THEN ON DETAILS WE WANNA SEE A LIST OF FULL ENTITIES

    // const getFullEntititesByCategory = async (category: string) => {
    //     try {

    //         const response = await services.FullDbService.getFullEntitiesByCategory(category);
    //         if (response.length > 0) {
    //             return response;
    //         }

    //         const apiresponse = await services.ApiService.getFullEntitiesByCategory(category);
    //         apiresponse.forEach((entity: Entity) => {
    //             services.FullDbService.addEntity(entity);
    //         });

    //         const finalResponse = await services.FullDbService.getFullEntitiesByCategory(category);
    //         return finalResponse;
    //     }
    //     catch (error: any) {
    //         Alert.alert('You are offline', 'Please check your internet connection');
    //     }

    //     return undefined;
    //  }

    const getOrders = async () => {
        try{
            const response = await services.ApiService.getOrders();
            return response;

        } catch (error: any) {
            if (error.response?.status == 404) {
                Alert.alert('Invalid input', error.response.data.message);
                return;
            }

            Alert.alert('You are offline', 'Please check your internet connection');
        }
    }

    const getTypes = async () => {
        try{
            const response = await services.ApiService.getTypes();
            return response;

        } catch (error: any) {
            if (error.response?.status == 404) {
                Alert.alert('Invalid input', error.response.data.message);
                return;
            }

            Alert.alert('You are offline', 'Please check your internet connection');
        }
    }

    // !! HERE CHANGE FIELDS
    const addEntity = async (entity: Entity) => {
        // ON DETAILS WE WANNA SEE A LIST OF FULL ENTITIES
        // const subresponse = await services.SubDbService.getSubEntities();


        try {
            const response = await services.ApiService.addEntity(entity);
            console.log(response);

            if (response.text === 'The entity already exists!'){
                Alert.alert('Invalid input', response.text);
                return;
            }

            // ON DETAILS WE WANNA SEE A LIST OF FULL ENTITIES

            // services.FullDbService.addEntity(response);

            // if (subresponse.find((subEntity: SubEntity) => subEntity.category == response.category)) {
            //     Alert.alert('Operation successful', 'Entity added successfully!');
            //     return;
            // }

            const subEntity = new SubEntity(response.id, response.name, response.supplier, response.type);
            services.SubDbService.addSubEntity(subEntity);

            Alert.alert('Operation successful', 'Entity added successfully!');
            dispatch({type: 'addEntity', payload: subEntity});
        }
        catch (error: any) {
            console.log(error);

            if (error.response?.status == 404) {
                Alert.alert('Invalid input', error.response.data.message);
                return;
            }

            if (!postOffline){
                Alert.alert('You are offline', 'Please check your internet connection');
                return;
            }

            // !! THIS IS FOR OFFLINE POST

            services.FullDbService.getEntitiesMinId().then((minId) => {
                entity.id = Math.min(minId, 0) - 1;
                services.FullDbService.addEntity(entity);

                const subEntity = new SubEntity(entity.id, entity.name, entity.supplier, entity.type);
                services.SubDbService.addSubEntity(subEntity);

                Alert.alert('Operation successful', 'Entity added successfully locally!');
                dispatch({type: 'addEntity', payload: subEntity});

            }).catch(error => {
                console.error("An error occurred: ", error);
            });
        }
    } 

    // !! HERE CHANGE FIELDS

    // const deleteEntity = async (entity: Entity) => {
    //     try {
    //         await services.ApiService.deleteEntity(entity.id);
    //         services.FullDbService.deleteEntity(entity.id);
    //         services.SubDbService.deleteSubEntity(entity.id);

    //         Alert.alert('Operation successful', 'Entity removed successfully!');
    //         const subEntity = new SubEntity(entity.id, entity.number, entity.address, entity.status);
    //         dispatch({type: 'removeEntity', payload: subEntity});
    //     }
    //     catch (error: any) {
    //         if (error.response?.status == 404) {
    //             Alert.alert('Invalid input', error.response.data.message);
    //             return;
    //         }

    //         if (!deleteOffline) {
    //             Alert.alert('You are offline', 'Please check your internet connection');
    //             return;
    //         }

    //         // !! THIS IS FOR OFFLINE DELETE

    //         services.FullDbService.deleteEntity(entity.id);
    //         services.SubDbService.deleteSubEntity(entity.id);

    //         const subEntity = new SubEntity(entity.id, entity.number, entity.address, entity.status);
    //         Alert.alert('Operation successful', 'Entity removed successfully locally!');
    //         dispatch({type: 'removeEntity', payload: subEntity});
    //     }
    // }

    // const updateEntity = async (entity: Entity) => {
    //     try {
    //         const response = await services.ApiService.updateEntity(entity);
    //         services.FullDbService.updateEntity(response);
    //         services.SubDbService.updateSubEntity(response);

    //         Alert.alert('Operation successful', 'Entity updated successfully!');
    //         const subEntity = new SubEntity(entity.id, entity.name);
    //         dispatch({type: 'updateEntity', payload: subEntity});
    //     }
    //     catch (error: any) {
    //         if (error.response.status == 404) {
    //             Alert.alert('Invalid input', error.response.data.message);
    //             return;
    //         }

    //         if (!putOffline) {
    //             Alert.alert('You are offline', 'Please check your internet connection');
    //             return;
    //         }

    //          // !! THIS IS FOR OFFLINE UPDATE

    //         services.FullDbService.updateEntity(entity);
    //         services.SubDbService.updateSubEntity(entity);
    //         Alert.alert('Operation successful', 'Entity updated successfully!');

    //         const subEntity = new SubEntity(entity.id, entity.name);
    //         dispatch({type: 'updateEntity', payload: subEntity});
    //     }
    // }

    const detailsEntity = async (entity: SubEntity) => {
        // const response = await services.FullDbService.getEntity(entity.id);

        try {
            // if (response) {
            //     return response;
            // }
            const apiresponse = await services.ApiService.detailsEntity(entity.id);
            // services.FullDbService.addEntity(apiresponse);
            return apiresponse;
        }
        catch (error: any) {
            if (error.response?.status == 404) {
                Alert.alert('Invalid input', error.response.data.message);
                return;
            }

            // if (response) {
            //     return response;
            // }

            Alert.alert('You are offline', 'Please check your internet connection');
        }

        return undefined;
    }

    const getForSearch = async () => {
        try {
            const response = await services.ApiService.getForSearch();
            return response;
        }
        
        catch (error: any) {
            Alert.alert('You are offline', 'Please check your internet connection');
        }

        return undefined;
    }

    const getCertainCategory = async () => {
        try {
            const response = await services.ApiService.getCertainCategory();
            return response;
        }
        
        catch (error: any) {
            Alert.alert('You are offline', 'Please check your internet connection');
        }

        return undefined;
    }

    const changeFieldRequest = async (type: string) => {
        try {
            
            const response = await services.ApiService.changeFieldRequest(type);
            if (response.text === `No entity with type: ${type}`){
                Alert.alert('Invalid input', response.text);
                return;
            }
            Alert.alert('Operation successful', 'Entity reserved successfully!');
            return response;
        }
        
        catch (error: any) {
            Alert.alert('You are offline', 'Please check your internet connection');
        }

        return undefined;
    }

    const changeFieldBorrowed = async (entity: SubEntity) => {
        try {
            const response = await services.ApiService.changeFieldBorrow(entity);
            if (response.text === 'No more copies available!'){
                Alert.alert('Invalid input', response.text);
                return;
            }
            Alert.alert('Operation successful', 'Entity borrowed successfully!');
            return response;
        }
        
        catch (error: any) {
            Alert.alert('You are offline', 'Please check your internet connection');
        }

        return undefined;
    }

    const top = async () => {
        try {
            const response = await services.ApiService.getSubEntities();
            return response;
        }
        
        catch (error: any) {
            Alert.alert('You are offline', 'Please check your internet connection');
        }

        return undefined;
    }

    const values: ContextValues = {
        entities: state.entities,
        getSubEntities,
        getEntities,
        // getFullEntititesByCategory,
        getOrders,
        getTypes,
        addEntity,
        // deleteEntity,
        // updateEntity,
        detailsEntity,
        getCertainCategory,
        getForSearch,
        changeFieldRequest,
        changeFieldBorrowed,
        top,
    }

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
  };

export {useAppContext, AppProvider};