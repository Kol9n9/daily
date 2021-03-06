import {Actions, createStore, Getters, Module, Mutations} from "vuex-smart-module";
import Schedule from "@/Models/Schedule";
import AppSettings from "@/Models/AppSettings";
import moment, {Moment} from "moment";
import {v4} from "uuid";
import TaskType from "@/Models/TaskType";
import Task from "@/Models/Task";
import Vue from "vue";
import Vuex from 'vuex'

class RootStoreState {
    hasNotSavedChanges: boolean = false;
    schedule: Schedule;
    appSettings: AppSettings;

    constructor() {
        const defaultTaskTypeId = v4();

        const defaultTaskType: TaskType = {
            id: defaultTaskTypeId,
            name: "Тип задачи по умолчанию",
            colors: [],
            font: "Aria",
            priority: 10
        };

        const firstTask: Task = {
            id: v4(),
            typeId: defaultTaskTypeId,
            name: "Первичная настройка",
            description: "Потыкать интерфейс. Создать типы задачь и сами задачи",
            begin: moment(),
            end: moment().add(1, 'hour'),
            isDone: false,
            taskType: defaultTaskType
        };

        this.schedule = {
            name: "Новое расписание",
            dayBegin: moment.duration(8, 'hours'),
            dayEnd: moment.duration(20, 'hour'),
            segmentLength: moment.duration(1, 'hour'),
            defaultTaskTypeId,
            taskTypes: [defaultTaskType],
            tasks: [firstTask],
            defaultTaskType
        };

        this.appSettings = {
            storageSettingsArray: [
                {
                    id: v4(),
                    name: "В браузере",
                    storageName: "LocalStorage",
                },
                {
                    id:v4(),
                    name: "На компьютере",
                    storageName: "FileStorage"
                },
                {
                    id:v4(),
                    name: "В облаке",
                    storageName: "CloudStorage"
                }
            ]
        };
    }
}

class RootStoreGetters extends Getters<RootStoreState> {
    get tasks() {
        return this.state.schedule.tasks;
    }

    get taskTypes() {
        return this.state.schedule.taskTypes;
    }

    get defaultTaskType() {
        return this.state.schedule.defaultTaskType
    }
}

class RootStoreMutations extends Mutations<RootStoreState> {
    addTask({task}: {task: Task}) {
        this.state.schedule.tasks.push(task);
        this.state.hasNotSavedChanges = true;
    }

    removeTask({taskId}: {taskId: string}) {
        const taskIndex = this.state.schedule.tasks.findIndex(x => x.id === taskId);

        if(taskIndex === -1) throw new Error();

        this.state.schedule.tasks.splice(taskIndex, 1);
        this.state.hasNotSavedChanges = true;
    }

    setNoChanges() {
        this.state.hasNotSavedChanges = false;
    }
}

class RootStoreActions extends Actions<RootStoreState, RootStoreGetters, RootStoreMutations, RootStoreActions> {
    createTask({name, begin, end}: {name: string, begin: Moment, end: Moment}) {
        const defaultTaskType = this.getters.defaultTaskType

        const newTask: Task = {
            id: v4(),
            typeId: defaultTaskType.id,
            name,
            begin,
            end,
            taskType: defaultTaskType,
            isDone: false,
        }

        this.mutations.addTask({task: newTask})
    }

    async saveSchedule({settingsId}: { settingsId?: string }) {
        throw new Error("Сохранение не реализовано");
        this.mutations.setNoChanges()
    }

    async loadSchedule({settingsId}: { settingsId?: string }) {
        throw new Error("Загрузка не реализована");
    }
}

export const rootStoreModule = new Module({
    state: RootStoreState,
    getters: RootStoreGetters,
    mutations: RootStoreMutations,
    actions: RootStoreActions
});

Vue.use(Vuex);
export const store = createStore(rootStoreModule);
