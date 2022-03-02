import {$, currentLanguage, ng,moment} from "entcore";
import {ROOTS} from "../../core/const/roots";
import {Folder, FolderItem, Mindmap, MindmapFolder, Mindmaps} from "../../model";
import {FOLDER_ITEM_TYPE} from "../../core/const/type";
import {Moment} from "moment";

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

    onUpdateMindmap(): void;

    onOpenMindmap(): void;

    openMindmap(mindmap): void;

    newMindmap(): void;

    onNewMindmap(): void;

    onChangeMindmapFolder(): void;

    getMindmapThumbnail(mindmap): string;

    selectFolder():void;

    onSelectFolder():void;

    selectMindmap():void;

    onSelectMindmap():void;

    onFormatDate();

    formatDate(dateMindmap);

    id: string;
    name: string;
    folderParentId: string;
    ownerId: string;
    folders: FolderItem[];
    mindmapsItem: Mindmap[];
    mindmap:{
        _id:string;
        name:string;
        type:string;
        selected:boolean;
    };


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
            onNewMindmap: '=',
            id: '=',
            onChangeMindmapFolder: '&',
            onMindmapIsSelected:'&',
            onSelectFolder:'=',
            onSelectMindmap:'=',
            onFormatDate:'=',

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

            vm.formatDate = function(dateObject){
                return moment(dateObject.$date).lang(currentLanguage).calendar();
            }

            vm.selectFolder = function () : void{
                $scope.$eval(vm.onSelectFolder);
            }

            vm.selectMindmap = function () : void{
                $scope.$eval(vm.onSelectMindmap);
            }

            vm.getMindmapThumbnail = (mindmap: Mindmap): string => {
                if (!mindmap.thumbnail || mindmap.thumbnail === '') {
                    return '/img/illustrations/mindmap.svg';
                }
                return mindmap.thumbnail + '?thumbnail=120x120';
            }

            vm.newMindmap = (): void => {
                $scope.$eval(vm.onNewMindmap);
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