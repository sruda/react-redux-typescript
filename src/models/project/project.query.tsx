/********************************/
/*         DEPENDENCIES         */
/********************************/
import gql from 'graphql-tag';

import { 
    PROJECT_FRAGMENT, 
    BASIC_PROJECT_FRAGMENT, 
    BASIC_PROJECT_AND_AUTHOR_FRAGMENT 
} from './project.fragment';
import { Project as ProjectModel, Basic } from './project.model';


// -----------------------------------


/********************************/
/*      INTERFACES & TYPES      */
/********************************/

/**
 * Arguments passed to Project queries
 */
export interface IProjectQueryArgs {
    id?: number;
}


/********************************/
/*            QUERIES           */
/********************************/

/**
 * @desc Get Project by Id
 * @method Method projectById
 * @public
 * @param {ID} $id - Project id
 * @returns {Project} Project entity
 */
export const GET_PROJECT_BY_ID_QUERY = gql`
    query getProjectById ($id: ID!) {
        projectById(id: $id) {
            ...ProjectFragment
        }
    }
    ${PROJECT_FRAGMENT}
`;

/*        TYPE         */
/***********************/

export type GetByIdResponse = {
    projectById: ProjectModel;
};


// --------------------------------


/**
 * @desc Get all Projects
 * @method Method allProjects
 * @public
 * @param {Int} $limit - limit number of results returned
 * @returns {Array<Project>} Project list
 */
export const GET_ALL_PROJECT_QUERY = gql`
query getAllProjects ($limit: Int!){
    allProjects(limit: $limit) {
        ...BasicProjectAndAuthorFragment
    }
}
${BASIC_PROJECT_AND_AUTHOR_FRAGMENT}
`;

/*        TYPE         */
/***********************/

export type GetAllResponse = {
    allProjects: Array<ProjectModel>;
};


// --------------------------------


/**
 * @desc Get Projects by Category
 * @method Method projectsByCategory
 * @public
 * @param {ProjectFilter} $filter - a set of filters
 * @param {Int} $limit - limit number of results returned
 * @returns {Array<Project>} Projects List of a specific category (Startups, Financial, Social Network, etc.)
 * TODO: Remover si no se esta usando
 */
export const GET_PROJECTS_BY_CATEGORY_QUERY = gql`
query getProjectsByCategory ($filter: ProjectFilter!, $limit: Int) {
    projectsByCategory(filter: $filter, limit: $limit) {
        ...ProjectFragment
    }
}
${PROJECT_FRAGMENT}
`;

/*        TYPE         */
/***********************/

export type GetByCategoryResponse = {
    projectsByCategory: Array<ProjectModel>;
};


// --------------------------------


/**
 * @desc Get Projects by User Id (Basic Info)
 * @method Method basicProjectsByUserId
 * @public
 * @returns {Array<Project>} Projects List of a specific user
 */
export const GET_BASIC_PROJECTS_BY_USER_ID_QUERY = gql`
query getBasicProjectsByUserId ($userId: ID!) {
    basicProjectsByUserId(userId: $userId) {
        ...BasicProjectFragment
    }
}
${BASIC_PROJECT_FRAGMENT}
`;

/*        TYPE         */
/***********************/

export type GetBasicProjectsByUserIdResponse = {
    basicProjectsByUserId: Array<Basic>;
};