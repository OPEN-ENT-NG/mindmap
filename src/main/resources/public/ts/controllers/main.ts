import {ng, angular, moment, _, template, Behaviours, toasts, workspace, idiom} from 'entcore';
import http from 'axios';
import {FolderItem, Folders, Mindmap, MindmapFolder} from '../model';
import {Folder} from '../model';
import {folderService} from "../services/folder.service";
import {mindmapService} from "../services/mindmap.service";
import models = workspace.v2.models;
import {FOLDER_ITEM_TYPE} from "../core/const/type";
import {FOLDER_ITEM} from "../core/const/folderItem";
import {Moment} from "moment";

declare let mapAdapter: any;
declare let currentLanguage: any;

declare let saveAs: (data, name, opts?) => void;


/**
 * Controller for mindmaps. All methods contained in this controller can be called
 * from the view.
 * @param $scope Angular JS model.
 * @param template all templates.
 * @param model the mindmap model.
 */



export const MindmapController = ng.controller('MindmapController', ['$scope', 'model', 'route', '$timeout', '$sce', '$location',
    ($scope, model, route, $timeout, $sce, $location) => {

        $scope.printMode = false;
        $scope.template = template;
        $scope.mindmaps = model.mindmaps;
        $scope.folders = model.folders;
        $scope.folder = model.folder;
        $scope.folderItem = model.folderItem;
        $scope.me = model.me;
        $scope.display = {};
        $scope.searchbar = {};
        $scope.editorLoaded = false;
        $scope.editorId = 0;
        $scope.exportInProgress = false;
        $scope.action = 'mindmap-list';
        $scope.notFound = false;
        $scope.forceToClose = false;
        $scope.isLightBoxActive = false;
        var _isLoading: boolean = false;
        $scope.openedFolderIds = [];
        $scope.openedFolderIdsMove = [];
        $scope.selectedFoldersId = FOLDER_ITEM.ID_NULL;
        $scope.selectedFoldersIdMove = null;


        /**
         * Create Folder for the root and add in the scope
         */
        $scope.setFolderRoot = function (): void {
            let folder: FolderItem = new FolderItem(FOLDER_ITEM.ID_ROOT, idiom.translate('mindmap.folder.title.root')).setType(FOLDER_ITEM_TYPE.FOLDER);
            let folderTab: FolderItem[] = [folder];
            $scope.foldersNull = new Folders(folderTab, []);
        }

        /**
         * Create Folder for the root and add in the scope in the tree of moveFolder
         */
        $scope.setFolderRootForMove = function (): void {
            let folder: FolderItem = new FolderItem(FOLDER_ITEM.ID_ROOT, idiom.translate('mindmap.folder.title.root')).setType(FOLDER_ITEM_TYPE.FOLDER);
            let folderTab: FolderItem[] = [folder];
            $scope.foldersNullMove = new Folders(folderTab, []);
        }

        $scope.isEmpty = function (): boolean {
            return $scope.folders.all != null
        }

        $scope.initFolder = async (): Promise<void> => {
            await $scope.setFolderChildrenMindmap(FOLDER_ITEM.ID_NULL);
            $scope.setFolderRoot();
            $scope.setFolderRootForMove();
            $scope.foldersNullMove.trees = $scope.foldersNullMove.mapToChildrenTrees();
            $scope.foldersNullMove.setFakeFolder($scope.foldersNullMove.trees);
            $scope.foldersNull.trees = $scope.foldersNull.mapToChildrenTrees();
            $scope.foldersNull.setFakeFolder($scope.foldersNull.trees);

            $scope.folderTreeRoot = {
                cssTree: "folders-tree",
                get trees() {
                    return $scope.foldersNull.trees;

                },
                isDisabled(folder: models.Element) {
                    return false;
                },
                isOpenedFolder(folder: models.Element) {
                    if (!folder._id || folder._id == "1") {
                        folder._id = FOLDER_ITEM.ID_NULL;
                        $scope.folderTreeRoot.openFolder(folder);
                    }
                    return $scope.openedFolderIds.contains(folder._id);
                },
                isSelectedFolder(folder: models.Element) {
                    if (!folder._id || folder._id == "1") {
                        folder._id = FOLDER_ITEM.ID_NULL;
                        $scope.selectedFoldersId = null
                    }
                    return $scope.selectedFoldersId == folder._id;
                },
                async openFolder(folder: models.Element) {
                    if (!folder._id) {
                        folder._id = null;
                    }
                    let elem = $scope.folders.findTree(this.trees, folder._id);
                    if (elem) {
                        let children: models.Element[] = elem.children;
                        if (children.length > 0 && !children[0]._id) {
                            await $scope.openFolderById(folder._id);
                            elem.children = $scope.folders.mapToChildrenTrees();
                            //setFakeFolder is use for the folder never open before.
                            $scope.folders.setFakeFolder(elem.children);
                        } else {
                            $scope.folders.all = $scope.folders.mapFromChildrenTree(elem.children);
                            await $scope.openFolderById(folder._id)
                        }
                        $scope.openOrCloseFolder(folder);
                        $scope.selectedFoldersId = folder._id;
                    }
                    $scope.$apply()
                }
            }
        }

        $scope.displayTreeMoveFolder = async function (idFolderSelect: string) {
            $scope.openedFolderIdsMove = [];
            $scope.selectedFoldersIdMove = null;
            $scope.setFolderRootForMove();
            $scope.foldersNullMove.trees = $scope.foldersNullMove.mapToChildrenTrees();
            $scope.foldersNullMove.setFakeFolder($scope.foldersNullMove.trees);
            $scope.folderTreeDirective = {
                cssTree: "folders-tree",
                get trees() {
                    return $scope.foldersNullMove.trees;
                },
                isDisabled(folder: models.Element) {
                    return false;
                },
                isOpenedFolder(folder: models.Element) {
                    if (!folder._id) {
                        folder._id = FOLDER_ITEM.ID_NULL;

                    }
                    return $scope.openedFolderIdsMove.contains(folder._id);
                },
                isSelectedFolder(folder: models.Element) {
                    if (!folder._id) {
                        folder._id = FOLDER_ITEM.ID_NULL;
                    }
                    return $scope.selectedFoldersIdMove == folder._id;
                },
                async openFolder(folder: models.Element) {
                    if (!folder._id) {
                        folder._id = FOLDER_ITEM.ID_NULL;
                    }
                    let elemMove = $scope.foldersNullMove.findTree(this.trees, folder._id);
                    if (elemMove) {
                        let children: models.Element[] = elemMove.children;
                        if (children.length > 0 && !children[0]._id) {
                            $scope.foldersNullMove.setFolders(await folderService.getFolderChildren(folder._id));
                            $scope.foldersNullMove.setFilterFolder(idFolderSelect);
                            elemMove.children = $scope.foldersNullMove.mapToChildrenTrees();
                            $scope.foldersNullMove.setFakeFolder(elemMove.children);
                        } else {
                            $scope.foldersNullMove.all = $scope.foldersNullMove.mapFromChildrenTree(elemMove.children);
                            $scope.foldersNullMove.setFolders(await folderService.getFolderChildren(folder._id));
                            $scope.foldersNullMove.setFilterFolder(idFolderSelect);
                        }
                        $scope.openOrCloseFolderMove(folder);
                        $scope.selectedFoldersIdMove = folder._id;
                    }
                    $scope.$apply()
                }
            }
        }

        $scope.moveFolder = async function (id: string, name: string): Promise<void> {
            let folder: Folder;
            if ($scope.selectedFoldersIdMove == FOLDER_ITEM.ID_NULL || !$scope.selectedFoldersIdMove) {
                folder = new Folder(name, null);
            } else {
                folder = new Folder(name, $scope.selectedFoldersIdMove);
            }
            await $scope.updateFolder(id, folder);
        }

        $scope.moveMindmap = async function (id: string, name: string): Promise<void> {
            let mindmap: MindmapFolder;
            if ($scope.selectedFoldersIdMove == FOLDER_ITEM.ID_NULL || !$scope.selectedFoldersIdMove) {
                mindmap = new MindmapFolder(name, null);
            } else {
                mindmap = new MindmapFolder(name, $scope.selectedFoldersIdMove);
            }
            await $scope.updateMindmap(id, mindmap);
        }

        $scope.openFolderByView = function (folder: models.Element): void {
            $scope.folderTreeRoot.openFolder(folder);
        }

        $scope.openOrCloseFolder = function (folder: models.Element): void {
            if ($scope.folderTreeRoot.isOpenedFolder(folder)) {
                if ($scope.folderTreeRoot.isSelectedFolder(folder))
                    $scope.openedFolderIds = $scope.openedFolderIds.filter((openFolderId) => openFolderId != folder._id)
            } else {
                $scope.openedFolderIds.push(folder._id);
            }
        }

        $scope.openOrCloseFolderMove = function (folder: models.Element): void {
            if ($scope.folderTreeDirective.isOpenedFolder(folder)) {
                if ($scope.folderTreeDirective.isSelectedFolder(folder))
                    $scope.openedFolderIdsMove = $scope.openedFolderIdsMove.filter((openFolderId) => openFolderId != folder._id)
            } else {
                $scope.openedFolderIdsMove.push(folder._id);
            }
        }

        $scope.openFolderById = async function (id: string): Promise<void> {
            template.open('mindmap', 'mindmap-list');
            $timeout(function () {
                $('body').trigger('whereami.update');
            }, 100)

            $scope.setFolderItem = await folderService.getFolderChildren(id)
            $scope.folders.setFolders($scope.setFolderItem);
            $scope.mindmapsItem.setMindmaps($scope.setFolderItem);
            if (id !== $scope.selectedFoldersId) {
                $scope.loadingFiles = [];
            }
        };

        $scope.reloadView = async (): Promise<void> => {
            $scope.openedFolderIds = [];
            $scope.selectedFoldersId = FOLDER_ITEM.ID_NULL;
            await $scope.openFolderById(FOLDER_ITEM.ID_NULL);
            $scope.initFolder();
            $scope.$apply()
        }

        $scope.setFolderChildrenMindmap = async (id: string): Promise<void> => {
            let folder: FolderItem[] = await folderService.getFolderChildren(id);
            $scope.folders = new Folders(folder, []);
            $scope.mindmapsItem = new Folders([], folder);
            $scope.foldersMove = new Folders(folder, []);
        };

        $scope.updateFolder = async (id: string, unFolder: Folder): Promise<void> => {
            try{
                await folderService.updateFolder(id, unFolder);
                toasts.confirm(idiom.translate('mindmap.folder.update.done'));
                await $scope.reloadView();
            } catch (e) {
                toasts.warning(idiom.translate('mindmap.folder.update.fail'));
                throw(e);
            }
        };

        $scope.updateMindmap = async (id: string, uneMindmap: Mindmap): Promise<void> => {
            try{
                await mindmapService.updateMindmap(id, uneMindmap);
                toasts.confirm(idiom.translate('mindmap.update.done'));
                template.open('mindmap', 'mindmap-list');
                await $scope.openFolderById($scope.selectedFoldersId);
            } catch (e) {
                toasts.warning(idiom.translate( "mindmap.update.fail"));
                throw(e);
            }
        };

        $scope.createFolder = async (name: string): Promise<void> => {
            let folder: Folder;
            if ($scope.selectedFoldersId == FOLDER_ITEM.ID_NULL) {
                folder = new Folder(name);
            } else {
                folder = new Folder(name, $scope.selectedFoldersId);
            }
            try {
                await folderService.createFolder(folder);
                $scope.display.createFolder = false;
                toasts.confirm(idiom.translate('mindmap.folder.create.done'));
                await $scope.reloadView();
            } catch (e) {
                toasts.warning(idiom.translate('mindmap.folder.create.fail'));
                throw (e);

            }
        };

        $scope.deleteFolder = async (id: string): Promise<void> => {
            try{
                await folderService.deleteFolder(id);
                toasts.confirm(idiom.translate('mindmap.folder.delete.done'));
                $scope.reloadView();

            } catch(e){
                toasts.warning(idiom.translate('mindmap.folder.delete.fail'));
                throw(e);
            }
        };

        $scope.deleteMindmap = async (id: string): Promise<void> => {
            try {
                await mindmapService.deleteMindmap(id);
                toasts.confirm(idiom.translate('mindmap.delete.done'));
                template.open('mindmap', 'mindmap-list');
                await $scope.openFolderById($scope.selectedFoldersId);
            } catch (e) {
                toasts.warning(idiom.translate('mindmap.delete.fail'));
                throw(e);
            }


        };

        $scope.isLoading = function (optionalVal) {
            if (typeof optionalVal === "undefined") return _isLoading;
            if (optionalVal != _isLoading) {
                _isLoading = optionalVal;
                $scope.$apply();
            }
        };

        $scope.showEmptyScreen = function () {
            return !$scope.isLoading() && $scope.mindmaps && $scope.mindmaps.all && $scope.mindmaps.all.length === 0;
        }

        // By default open the mindmap list
        template.open('mindmap', 'mindmap-list');
        template.open('folder', 'folder-list');
        template.open('side-panel', 'mindmap-side-panel');

        /**
         * Allows to create a new mindmap and open the "mindmap-edit.html" template into
         * the "main" div.
         */
        $scope.newMindmap = function (): void {
            $scope.mindmap = new Mindmap();
            $scope.action = 'mindmap-create';
            template.open('mindmap', 'mindmap-create');
        };

        $scope.goto = function (path) {
            $location.path(path);
            window.location.hash = '/';

            $scope.reloadView();
            $scope.cancelMindmapEdit();

        };

        $scope.createMindmap = async function (name: string): Promise<void> {
            $scope.forceToClose = true;
            var mindmap: MindmapFolder;
            if ($scope.selectedFoldersId == "null") {
                mindmap = new MindmapFolder(name);
            } else {
                mindmap = new MindmapFolder(name, $scope.selectedFoldersId);
            }

           try {
               await mindmapService.createMindmap(mindmap);
               $scope.cancelMindmapEdit();
                toasts.confirm(idiom.translate("mindmap.create.done"));
                template.open('mindmap', 'mindmap-list');
                await $scope.openFolderById($scope.selectedFoldersId);
            } catch (e) {
               toasts.warning(idiom.translate('mindmap.create.fail'));
               throw(e);
           }
        };

        /**
         * Allows to save the current edited mindmap in the scope. After saving the
         * current mindmap this method closes the edit view too.
         */
        $scope.saveMindmap = async function () {
            $scope.forceToClose = true;
            $scope.mindmapCopy = angular.copy($scope.mindmap);
            await $scope.mindmapCopy.save();


            $scope.cancelMindmapEdit();
        };

        /**
         * Save the current mindmap in database
         */
        $scope.saveMap = async function () {
            $scope.mindmapCopy = angular.copy($scope.mindmap);
            await $scope.mindmapCopy.save();
            $scope.cancelMindmapEdit();

        };
        /**
         * Retrieve the mindmap thumbnail if there is one
         */
        $scope.getMindmapThumbnail = function (mindmap) {
            if (!mindmap.thumbnail || mindmap.thumbnail === '') {
                return '/img/illustrations/mindmap.svg';
            }
            return mindmap.thumbnail + '?thumbnail=120x120';
        };
        /**
         * Open a mindmap in the wisemapping editor
         */
        $scope.openMindmap = function (mindmap) {
            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            $scope.notFound = false;

            template.close('main');
            template.close('mindmap');


            $scope.mindmaps.forEach(function (m) {
                m.showButtons = false;
            });
            $scope.editorId = $scope.editorId + 1;
            $scope.mindmap = $scope.selectedMindmap = mindmap;
            mapAdapter.adapt($scope);
            $scope.action = 'mindmap-open';
            template.open('mindmap', 'mindmap-edit');
            window.location.hash = '/view/' + $scope.mindmap._id;


        };
        $scope.printPngMindmap = function (mindmap, redirect = true) {
            if (redirect) {
                window.open('/mindmap/print/mindmap#/print/png/' + mindmap._id);
                return;
            }
            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            $scope.notFound = false;
            $scope.printMode = true;
            $scope.printModePng = true;

            template.close('main');
            template.close('mindmap');
            template.close('mindmap-list');


            $scope.mindmaps.forEach(function (m) {
                m.showButtons = false;
            });
            $scope.editorId = $scope.editorId + 1;
            $scope.mindmap = $scope.selectedMindmap = mindmap;
            mapAdapter.adapt($scope);
            $scope.action = 'mindmap-open';
            $("body").attr("style", "");
            $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
            template.open('mindmap', 'mindmap-print-png');


            this.svgLoaded = async () => {
                const svg = $('#workspaceContainer');
                const response = await http.post("/mindmap/export/png", {
                    svgXml: svg[0].innerHTML
                });
                $('#mindmap-editor')[0].remove();
                const imageData = response.data.image;
                $("img#printpng").attr("src", "data:image/png;base64," + imageData);
                $("body").attr("style", "");
                setTimeout(() => window.print(), 1000)
            };

        }

        $scope.printMindmap = function (mindmap, redirect = true) {
            if (redirect) {
                window.open('/mindmap/print/mindmap#/print/' + mindmap._id);
                return;
            }
            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            $scope.notFound = false;
            $scope.printMode = true;

            template.close('main');
            template.close('mindmap');
            template.close('mindmap-list');


            $scope.mindmaps.forEach(function (m) {
                m.showButtons = false;
            });
            $scope.editorId = $scope.editorId + 1;
            $scope.mindmap = $scope.selectedMindmap = mindmap;
            mapAdapter.adapt($scope);
            $scope.action = 'mindmap-open';
            //$scope.mindmap.readOnly = model.me.hasRight(mindmap, Behaviours.applicationsBehaviours.mindmap.rights.resource.contrib);

            $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
            template.open('mindmap', 'mindmap-print');


            this.svgLoaded = () => {
                const svg = $('#workspaceContainer');
                svg.find("svg").removeAttr("preserveAspectRatio").attr("preserveAspectRatio", "true")
                $scope.svg = $sce.trustAsHtml(svg[0].innerHTML);
                $('#mindmap-editor')[0].remove();
                setTimeout(() => {
                    window.print()
                }, 3000)
            };

        };

        /**
         * Display date in French format
         */
        $scope.formatDate = function (dateObject): Moment {
            return moment(dateObject.$date).lang(currentLanguage).calendar();
        };

        /**
         * Display export options
         */
        $scope.exportMindmap = function () {
            $scope.display.showExportPanel = true;
            $scope.exportType = "png";
        }

        /**
         * Convert base64 data to Blob
         */
        function b64toBlob(b64Data, contentType: string, sliceSize?: number): Blob {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            // Fix for IE and Safari : remove whitespace characters (such as space, tab, carriage return, new line)
            b64Data = b64Data.replace(/\s/g, '');

            var byteCharacters: string = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray: Uint8Array = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob: Blob = new Blob(byteArrays, {type: contentType});
            return blob;
        }

        /**
         * Export a mindmap into png or svg
         */
        $scope.exportMindmapSubmit = function (exportType): void {
            $scope.exportInProgress = true;
            http.post('/mindmap/export/' + exportType, {svgXml: $('#workspaceContainer')[0].innerHTML})
                .then(function (data) {
                    let filename: string = $scope.mindmap.name + "." + exportType;
                    let imageData = data.data.image;
                    if ("svg" !== exportType) {
                        saveAs(b64toBlob(imageData, "image/" + exportType), filename);
                    } else {
                        saveAs(new Blob([imageData], {type: "image/svg+xml;charset=utf-8"}), filename);
                    }
                    $scope.$apply("exportInProgress = false");
                });
            $scope.display.showExportPanel = false;
        }

        /**
         * Checks if a user is a manager
         */
        $scope.canManageMindmap = function (mindmap): boolean {
            return (!!mindmap.myRights.manage);

        };

        /**
         * Check if the user can export either in SVG either in PNG format
         **/
        $scope.canExport = function (): boolean {
            var workflowRights = Behaviours.applicationsBehaviours.mindmap.rights.workflow;

            return (model.me.hasWorkflow(workflowRights["exportpng"]) || model.me.hasWorkflow(workflowRights["exportsvg"]));
        }

        /**
         * Close the mindmap editor and open the mindmap list page
         */
        $scope.cancelMindmapEdit = function (): void {
            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            template.close('main');
            $scope.action = 'mindmap-list';
            template.open('mindmap', 'mindmap-list');
            $scope.$apply();
            $scope.forceToClose = false;
        }

        /**
         * List of mindmap objects
         */
        $scope.openMainPage = function (): void {
            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            $scope.action = 'mindmap-list';
            $scope.action = 'folder-list';
            template.open('mindmap', 'mindmap-list');
            window.location.hash = "";
        }


        /**
         * Allows to set "showButtons" to false for all mindmaps except the given one.
         * @param mindmap the current selected mindmap.
         * @param event triggered event
         */
        $scope.hideAlmostAllButtons = function (mindmap, event): void {
            event.stopPropagation();

            if (mindmap.showButtons) {
                $scope.mindmap = mindmap;
            } else {
                delete $scope.mindmap;
            }

            $scope.mindmaps.forEach(function (m) {
                if (!mindmap || m._id !== mindmap._id) {
                    m.showButtons = false;
                }
            });
        };

        /**
         * Allows to set "showButtons" to false for all mindmaps except the given one.
         * @param mindmap the current selected mindmap.
         * @param event triggered event
         */
        $scope.hideAllButtons = function (mindmap, event): void {
            event.stopPropagation();

            if (mindmap.showButtons) {
                $scope.mindmap = mindmap;
            } else {
                delete $scope.mindmap;
            }

            $scope.mindmaps.forEach(function (m) {
                if (!mindmap || m._id !== mindmap._id) {
                    m.showButtons = false;
                }
            });
        };

        /**
         * Edit the properties (name, description) of a mindmap
         */
        $scope.editMindmap = function (mindmap, event): void {
            event.stopPropagation();
            mindmap.showButtons = false;
            $scope.mindmapCopy = mindmap;
            $scope.mindmap = angular.copy(mindmap);
            template.open('mindmap', 'mindmap-create');
        }

        /**
         * Allows to put the current mindmap in the scope and set "confirmDeleteMindmap"
         * variable to "true".
         * @param mindmap the mindmap to delete.
         * @param event an event.
         */
        $scope.confirmRemoveMindmap = function (mindmap, event): void {
            event.stopPropagation();
            $scope.mindmap = mindmap;
            $scope.display.confirmDeleteMindmap = true;
        };

        /**
         * Allows to cancel the current delete process.
         */
        $scope.cancelRemoveMindmap = function () :void{
            delete $scope.display.confirmDeleteMindmap;
        };

        /**
         * Allows to remove the current mindmap in the scope.
         */
        $scope.removeMindmap = function () :void {
            _.map($scope.mindmaps.selection(), async function (mindmap) {
                await mindmap.delete();
                $scope.updateSearchBar();
                $scope.$apply();
            });

            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            $scope.display.confirmDeleteMindmap = false;

        };

        /**
         * Allows to open the "share" panel by setting the
         * "$scope.display.showPanel" variable to "true".
         * @param mindmap the mindmap to share.
         * @param event the current event.
         */
        $scope.shareMindmap = function (mindmap, event):void {
            $scope.mindmap = mindmap;
            $scope.display.showPanel = true;
            event.stopPropagation();
        };

        /**
         * Mindmap routes definition
         */
        route({
            /**
             * Retrieve a mindmap from its database id and open it in a wisemapping editor
             */
            viewMindmap: async () : Promise<void>=> {

                if ($scope.mindmap) {
                    $scope.notFound = "false";
                    $scope.openMindmap($scope.mindmap);
                } else {
                    $scope.notFound = "true";
                    $scope.openMainPage();
                }
            },
            /**
             * Retrieve a mindmap from its database id and open it in a wisemapping editor
             */
            printMindmap: async (params):Promise<void> => {

                if ($scope.mindmap) {
                    $scope.notFound = "false"
                    $scope.printMindmap($scope.mindmap, false);
                } else {
                    $scope.notFound = "true";
                    $scope.openMainPage();
                }
            },
            printPngMindmap: async (params):Promise<void> => {
                if ($scope.mindmap) {
                    $scope.notFound = "false";
                    $scope.printPngMindmap($scope.mindmap, false);
                } else {
                    $scope.notFound = "true";
                    $scope.openMainPage();
                }
            },

            /**
             * Display the mindmap tree
             **/
            main: async () :Promise<void> => {
                await $scope.initFolder();
                $scope.$apply();
            },

        });
    }]);