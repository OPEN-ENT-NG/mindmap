import {$, ng,} from "entcore";
import {ROOTS} from "../../core/const/roots";
import {Folder, FolderItem, Mindmap, MindmapFolder, Mindmaps} from "../../model";
import {FOLDER_ITEM_TYPE} from "../../core/const/type";

interface IViewModel {
    $onInit();

    $onDestroy();

    getFolderMindmapChildren(id: string): void;

    openFolder(folder): void;

    drag(item: FolderItem, $originalEvent): void;

    dropCondition(targetItem: FolderItem): (event: any) => string;

    dropToFolder(targetItem: FolderItem, $originalEvent): void;

    onOpenFolder(): void;

    onUpdateFolder(): void;

    RenameFolder(id: string, name: string): void;

    deleteFolder(id: string): void;

    deleteMindmap(id: string): void;

    RenameMindmap(id: string, name: string): void;

    onUpdateMindmap(): void;

    onDeleteFolder(): void;

    onDeleteMindmap(): void;

    onOpenMindmap(): void;

    openMindmap(mindmap): void;

    newMindmap(): void;

    onNewMindmap(): void;

    moveFolder(id: string, name: string): void;

    onMoveFolder(): void;

    treeMoveFolder();

    treeFolder(id: string);

    onMoveMindmap(): void;

    moveMindmap(id: string, name: string): void;

    editMindmap(mindmap: Mindmap, $event): void;

    onEditMindmap(): void;

    shareMindmap(mindmap: Mindmap, $event): void;

    onShareMindmap(): void;

    printPngMindmap(mindmap: Mindmap, $event): void;

    onPrintPngMindmap(): void;

    onChangeMindmapFolder(): void;


    id: string;
    name: string;
    folderParentId: string;
    ownerId: string;
    folders: FolderItem[];
    mindmapsItem: Mindmap[];
    display: {
        showPanel: boolean;
    }

}

export const directiveFolderList = ng.directive('directiveFolderList', () => {
    return {
        templateUrl: `${ROOTS.directive}directive-folder/directive-folder-list.html`,
        scope: {
            folders: '=',
            mindmapsItem: '=',
            onOpenFolder: '&',
            onUpdateFolder: '&',
            onUpdateMindmap: '&',
            onOpenMindmap: '&',
            onDeleteFolder: '&',
            onDeleteMindmap: '&',
            onNewMindmap: '=',
            onFolderTreeRoot: '=',
            onMoveFolder: '&',
            id: '=',
            treeMoveFolder: '&',
            onMoveMindmap: '&',
            selectedFoldersId: '=',
            onEditMindmap: '&',
            onShareMindmap: '&',
            onPrintPngMindmap: '&',
            onChangeMindmapFolder: '&',
        },

        restrict: 'E',
        controllerAs: 'vm',
        bindToController: true,
        replace: false,


        controller: function () {
            const vm: IViewModel = <IViewModel>this;
            vm.$onInit = async () => {

            };

            vm.$onDestroy = async () => {

            };
        },

        link: function ($scope) {
            const vm: IViewModel = $scope.vm;

            vm.printPngMindmap = (mindmap: Mindmap, $event): void => {
                $scope.$eval(vm.onPrintPngMindmap)(mindmap, $event)
            }

            vm.shareMindmap = (mindmap: Mindmap, $event): void => {
                $scope.$eval(vm.onShareMindmap)(mindmap, $event)
            }

            vm.editMindmap = (mindmap: Mindmap, $event): void => {
                $scope.$eval(vm.onEditMindmap)(mindmap, $event);
            }

            vm.treeFolder = (id: string) => {
                $scope.$eval(vm.treeMoveFolder)(id);
            }

            vm.moveMindmap = (id: string, name: string): void => {
                $scope.$eval(vm.onMoveMindmap)(id, name);
            };

            vm.moveFolder = (id: string, name: string): void => {
                $scope.$eval(vm.onMoveFolder)(id, name);
            }

            vm.newMindmap = (): void => {
                $scope.$eval(vm.onNewMindmap);
            }

            vm.deleteFolder = (id: string): void => {
                $scope.$eval(vm.onDeleteFolder)(id);
            }

            vm.deleteMindmap = (id: string): void => {
                $scope.$eval(vm.onDeleteMindmap)(id);
            }

            vm.RenameMindmap = (id: string, name: string): void => {
                let body = new MindmapFolder(name);
                $scope.$eval(vm.onUpdateMindmap)(id, body);
            }

            vm.RenameFolder = (id: string, name: string): void => {
                let body = new Folder(name);
                $scope.$eval(vm.onUpdateFolder)(id, body);
            }

            vm.openFolder = (folder: FolderItem): void => {
                $scope.$eval(vm.onOpenFolder)(folder);
            }

            vm.openMindmap = (mindmap: Mindmap): void => {
                $scope.$eval(vm.onOpenMindmap)(mindmap);
            }


            vm.drag = function (item: FolderItem | Mindmap, $originalEvent): void {
                try {
                    $originalEvent.dataTransfer.setData('application/json', JSON.stringify(item));
                } catch (e) {
                    $originalEvent.dataTransfer.setData('Text', JSON.stringify(item));
                }
            };

            vm.dropCondition = function (): (event: any) => string {
                return function (event) {
                    let dataField: string = event.dataTransfer.types.indexOf && event.dataTransfer.types.indexOf("application/json") > -1 ? "application/json" : //Chrome & Safari
                        event.dataTransfer.types.contains && event.dataTransfer.types.contains("application/json") ? "application/json" : //Firefox
                            event.dataTransfer.types.contains && event.dataTransfer.types.contains("Text") ? "Text" : //IE
                                undefined

                    return dataField;
                }
            };

            vm.dropToFolder = function (targetItem: FolderItem, $originalEvent): void {
                let dataField: string = vm.dropCondition(targetItem)($originalEvent);
                let originalItem: FolderItem = JSON.parse($originalEvent.dataTransfer.getData(dataField));

                if (originalItem._id === targetItem._id)
                    return;

                if (targetItem.type === FOLDER_ITEM_TYPE.MINDMAP)
                    return;

                let originId: string = originalItem._id;
                let targetId: string = targetItem._id;

                if (originalItem.type === FOLDER_ITEM_TYPE.MINDMAP) {
                    let userId: string = "userId";
                    let folder_parent_id: string = targetId
                    let folder_parent = {userId, folder_parent_id}
                    let mindmapBody: MindmapFolder = new MindmapFolder(originalItem.name.toString(), folder_parent);
                    $scope.$eval(vm.onChangeMindmapFolder)(originId, mindmapBody);

                } else {
                    let folderBody: Folder = new Folder(originalItem.name.toString(), targetId);
                    $scope.$eval(vm.onUpdateFolder)(originId, folderBody);
                }

            };


        }
    }
})