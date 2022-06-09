import {ng, angular, moment, _, template, Behaviours, toasts, workspace, idiom as lang, notify} from 'entcore';
import http from 'axios';
import {FolderItem, Folders, Mindmap, MindmapFolder, Mindmaps} from '../model';
import {Folder} from '../model';
import {folderService} from "../services/folder.service";
import {mindmapService} from "../services/mindmap.service";
import models = workspace.v2.models;
import {FOLDER_ITEM_TYPE} from "../core/const/type";
import {FOLDER_ITEM} from "../core/const/folderItem";
import {Moment} from "moment";
import forEach = require("core-js/fn/array/for-each");

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
        (window as any).LAZY_MODE = false;
        $scope.nameLabel = lang.translate('mindmap.checkbox.my')
        $scope.nameLabelShare = lang.translate('mindmap.checkbox.share')
        $scope.isCheckedLabelMy = true;
        $scope.isCheckedLabelShare = true;
        $scope.selectedMindmapTabs = [];
        $scope.selectedFolderTabs = [];
        $scope.orginialValue = "";

        $scope.getOrignialValue = function (name: string): void {
            $scope.orginialValue = name;
        }

        $scope.cancelNameMindmap = function (mindmap: Mindmap): void {
            mindmap.name = $scope.orginialValue;
        }

        $scope.cancelNameFolder = function (folder: FolderItem): void {
            folder.name = $scope.orginialValue;
        }

        $scope.deleteFoldersAndMindmaps = function (folderTab): void {
            $scope.deleteFolder(folderTab);
            $scope.removeMindmap();
        }


        $scope.selectFolder = function (): void {
            $scope.selectedFolderTabs = $scope.selectedFoldersItem();
        }

        $scope.selectMindmap = function (): void {
            $scope.selectedMindmapTabs = $scope.selectedMindmaps();
        }

        $scope.selectedFoldersItem = function (): FolderItem[] {
            return $scope.folders.all.filter(folder => folder.selected);
        }


        $scope.selectedMindmaps = function (): Mindmaps {
            return $scope.mindmapsItem.mindmapsRight.filter(mindmap => mindmap.selected);
        }

        $scope.renameFolder = (id: string, name: string): void => {
            let body = new Folder(name);
            $scope.updateFolderName(id, body);
        }

        $scope.renameMindmap = (id: string, name: string): void => {
            let body = new MindmapFolder(name);
            $scope.updateMindmap(id, body);
        }


        $scope.sortMindmap = async (isChecked: boolean): Promise<void> => {
            if (!isChecked && !$scope.isCheckedLabelShare) {
                $scope.isCheckedLabelShare = true;

            }
            if (!isChecked) {
                $scope.isCheckedLabelMy = false;
                await $scope.openFolderById($scope.selectedFoldersId, true, false);
                $scope.$apply();
            } else {
                $scope.isCheckedLabelMy = true;
                await $scope.openFolderById($scope.selectedFoldersId, true, true);
                $scope.$apply();
            }

        }
        $scope.sortShare = async (isChecked: boolean): Promise<void> => {
            if (!isChecked && !$scope.isCheckedLabelMy) {
                $scope.isCheckedLabelMy = true;

            }
            if (!isChecked) {
                $scope.isCheckedLabelShare = false;
                await $scope.openFolderById($scope.selectedFoldersId, false, true);
                $scope.$apply();
            } else {
                $scope.isCheckedLabelShare = true;
                await $scope.openFolderById($scope.selectedFoldersId, true, true);
                $scope.$apply();
            }
        }

        $scope.setFolderChildrenMindmap = async (id: string, isShare: boolean, isMine: boolean): Promise<void> => {
            let folderItem: FolderItem[] = await Promise.all(await folderService.getFolderChildren(id, isShare, isMine));
            $scope.folders = new Folders(folderItem, []);
            $scope.mindmapsItem = new Folders([], folderItem);
            $scope.foldersMove = new Folders(folderItem, []);
            $scope.$apply();
        };


        /**
         * Create Folder for the root and add in the scope
         */
        $scope.setFolderRoot = function (): void {
            let folder: FolderItem = new FolderItem(FOLDER_ITEM.ID_ROOT, lang.translate('mindmap.folder.title.root')).setType(FOLDER_ITEM_TYPE.FOLDER);
            let folderTab: FolderItem[] = [folder];
            $scope.foldersRoot = new Folders(folderTab, []);
        }

        /**
         * Create Folder for the root and add in the scope in the tree of moveFolder
         */
        $scope.setFolderRootForMove = function (): void {
            let folder: FolderItem = new FolderItem(FOLDER_ITEM.ID_ROOT, lang.translate('mindmap.folder.title.root')).setType(FOLDER_ITEM_TYPE.FOLDER);
            let folderTab: FolderItem[] = [folder];
            $scope.foldersRootMove = new Folders(folderTab, []);
        }

        $scope.isEmpty = function (): boolean {
            return $scope.folders.all != null
        }

        $scope.initFolder = async (): Promise<void> => {
            if ($scope.isCheckedLabelMy == true) {
                await $scope.setFolderChildrenMindmap(FOLDER_ITEM.ID_NULL, false, true);
            } else if ($scope.isCheckedLabelShare == true) {
                await $scope.setFolderChildrenMindmap(FOLDER_ITEM.ID_NULL, true, false);
            } else {
                await $scope.setFolderChildrenMindmap(FOLDER_ITEM.ID_NULL, true, true);
            }

            $scope.setFolderRoot();
            $scope.setFolderRootForMove();
            $scope.foldersRootMove.trees = $scope.foldersRootMove.mapToChildrenTrees();
            $scope.foldersRootMove.setFakeFolder($scope.foldersRootMove.trees);
            $scope.foldersRoot.trees = $scope.foldersRoot.mapToChildrenTrees();
            $scope.foldersRoot.setFakeFolder($scope.foldersRoot.trees);

            $scope.folderTreeRoot = {
                cssTree: "folders-tree",
                get trees() {
                    return $scope.foldersRoot.trees;

                },
                isDisabled(folder: models.Element) {
                    return false;
                },
                isOpenedFolder(folder: models.Element) {
                    if (!folder._id) {
                        folder._id = FOLDER_ITEM.ID_NULL;
                        $scope.folderTreeRoot.openFolder(folder);

                    }
                    return $scope.openedFolderIds.contains(folder._id);
                },
                isSelectedFolder(folder: models.Element) {
                    if (!folder._id) {
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
                            await $scope.IsShare(folder._id);
                            $scope.selectedMindmapTabs = [];
                            $scope.selectedFolderTabs = [];
                            elem.children = $scope.folders.mapToChildrenTrees();
                            //setFakeFolder is use for the folder never open before.
                            $scope.folders.setFakeFolder(elem.children);
                            elem.children.forEach(unelem => {
                                $scope.openedFolderIds = $scope.openedFolderIds.filter((openFolderId) => openFolderId != unelem._id);
                            })
                        } else {
                            $scope.mindmapsItem.setMindmaps(await folderService.getFolderChildren(folder._id, $scope.isCheckedLabelShare, $scope.isCheckedLabelMy));
                            $scope.folders.all = $scope.folders.mapFromChildrenTree(elem.children);

                            await $scope.IsShare(folder._id);
                            $scope.selectedMindmapTabs = [];
                            $scope.selectedFolderTabs = [];
                        }
                        $scope.openOrCloseFolder(folder);
                        $scope.selectedFoldersId = folder._id;
                    }
                    $scope.$apply()
                }
            }
            $scope.$apply();
        }

        $scope.displayTreeMoveFolder = async function (idFolderSelect: string) {
            $scope.openedFolderIdsMove = [];
            $scope.selectedFoldersIdMove = null;
            $scope.setFolderRootForMove();
            $scope.foldersRootMove.trees = $scope.foldersRootMove.mapToChildrenTrees();
            $scope.foldersRootMove.setFakeFolder($scope.foldersRootMove.trees);
            $scope.folderTreeDirective = {
                cssTree: "folders-tree",
                get trees() {
                    return $scope.foldersRootMove.trees;
                },
                isDisabled(folder: models.Element) {
                    return false;
                },
                isOpenedFolder(folder: models.Element) {
                    if (!folder._id) {
                        folder._id = FOLDER_ITEM.ID_NULL;
                        $scope.folderTreeDirective.openFolder(folder);

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
                    let elemMove = $scope.foldersRootMove.findTree(this.trees, folder._id);
                    if (elemMove) {
                        let children: models.Element[] = elemMove.children;
                        if (children.length > 0 && !children[0]._id) {
                            $scope.foldersRootMove.setFolders(await folderService.getFolderChildren(folder._id, true, true));
                            $scope.foldersRootMove.setFilterFolder(idFolderSelect);
                            elemMove.children = $scope.foldersRootMove.mapToChildrenTrees();
                            $scope.foldersRootMove.setFakeFolder(elemMove.children);
                        } else {
                            $scope.foldersRootMove.all = $scope.foldersRootMove.mapFromChildrenTree(elemMove.children);
                            $scope.foldersRootMove.setFolders(await folderService.getFolderChildren(folder._id, true, true));
                            $scope.foldersRootMove.setFilterFolder(idFolderSelect);
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

        $scope.updateFolderName = async (id: string, unFolder: Folder): Promise<void> => {
            try {
                await folderService.updateFolder(id, unFolder);
                notify.success(lang.translate('mindmap.folder.update.done'));

                await $scope.openTreeAndViewFolder();
                $scope.$apply();

            } catch (e) {
                notify.error(lang.translate('mindmap.folder.update.fail'));
                throw(e);
            }
            $scope.$apply();
        };

        $scope.moveMindmap = async function (id: string, name: string): Promise<void> {
            let mindmap: MindmapFolder;
            if ($scope.selectedFoldersIdMove == FOLDER_ITEM.ID_NULL || !$scope.selectedFoldersIdMove) {
                let userId: string = FOLDER_ITEM.ID_NULL;
                let folder_parent_id: string = FOLDER_ITEM.ID_NULL;
                let folder_parent = {userId, folder_parent_id}
                mindmap = new MindmapFolder(name, folder_parent);
            } else {
                let userId = FOLDER_ITEM.ID_NULL;
                let folder_parent_id = $scope.selectedFoldersIdMove;
                let folder_parent = {userId, folder_parent_id}
                mindmap = new MindmapFolder(name, folder_parent);
            }
            await $scope.changeMindmapFolder(id, mindmap);
        }

        $scope.openFolderByView = async function (folder: models.Element): Promise<void> {
            await $scope.folderTreeRoot.openFolder(folder);
            $scope.selectedMindmapTabs = [];
            $scope.selectedFolderTabs = [];
            $scope.$apply();
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

        $scope.openFolderById = async function (id: string, isShare: boolean, isMine: boolean): Promise<void> {
            template.open('mindmap', 'mindmap-list');
            let folderItems: FolderItem[];
            $scope.selectedMindmapTabs = [];
            $scope.selectedFolderTabs = [];
            folderItems = await Promise.all(await folderService.getFolderChildren(id, isShare, isMine));
            $scope.mindmapsItem.setMindmaps(folderItems);
            $scope.folders.setFolders(folderItems);


            $scope.$apply();
        };

        $scope.IsShare = async (id: string): Promise<void> => {
            if (!$scope.isCheckedLabelMy && !$scope.isCheckedLabelShare) {
                await $scope.openFolderById(id, true, true);
                $scope.$apply();
            } else {
                await $scope.openFolderById(id, $scope.isCheckedLabelShare, $scope.isCheckedLabelMy);
                $scope.$apply();
            }
        }

        $scope.reloadView = async (): Promise<void> => {
            $scope.openedFolderIds = [];
            $scope.selectedFoldersId = FOLDER_ITEM.ID_NULL;
            await $scope.IsShare(FOLDER_ITEM.ID_NULL);
            $scope.initFolder();
            $scope.$apply();
        }


        $scope.updateFolder = async (id: string, unFolder: Folder): Promise<void> => {
            try {
                await folderService.updateFolder(id, unFolder);
                notify.success(lang.translate('mindmap.folder.update.done'));

                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
                await $scope.reloadView();

            } catch (e) {
                notify.error(lang.translate('mindmap.folder.update.fail'));
                throw(e);
            }
            $scope.$apply();
        };

        $scope.updateMindmapFromForm = async (id: string, name: string, folder_parent_id: string, description: string, thumbnail: string): Promise<void> => {
            $scope.forceToClose = true;
            var mindmapUpdate: MindmapFolder = new MindmapFolder(name, folder_parent_id, description, thumbnail);
            await $scope.updateMindmap(id, mindmapUpdate);
            $scope.cancelMindmapEdit();


        }

        $scope.updateMindmap = async (id: string, mindmap: Mindmap): Promise<void> => {
            try {
                await mindmapService.updateMindmap(id, mindmap);

                notify.success(lang.translate('mindmap.update.done'));
                template.open('mindmap', 'mindmap-list');
                await $scope.IsShare($scope.selectedFoldersId);
                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
            } catch (e) {
                notify.error(lang.translate("mindmap.update.fail"));
                throw(e);
            }
        };

        $scope.changeMindmapFolder = async (id: string, mindmap: Mindmap): Promise<void> => {
            try {
                await mindmapService.changeMindmapFolder(id, mindmap);
                notify.success(lang.translate('mindmap.update.done'));
                template.open('mindmap', 'mindmap-list');
                await $scope.IsShare($scope.selectedFoldersId);
            } catch (e) {
                notify.error(lang.translate("mindmap.update.fail"));
                throw (e)
            }
        }

        $scope.createFolder = async (name: string): Promise<void> => {
            let folder: Folder;
            if ($scope.selectedFoldersId == FOLDER_ITEM.ID_NULL) {
                folder = new Folder(name);
            } else {
                folder = new Folder(name, $scope.selectedFoldersId);
            }
            try {
                await folderService.createFolder(folder);

                notify.success(lang.translate('mindmap.folder.create.done'));
                $scope.display.createFolder = false
                await $scope.openTreeAndViewFolder();
                $scope.$apply();
            } catch (e) {
                notify.error(lang.translate('mindmap.folder.create.fail'));
                throw (e);

            }
            $scope.$apply();
        };

        $scope.openTreeAndViewFolder = async (): Promise<void> => {
            $scope.selectedMindmapTabs = [];
            $scope.selectedFolderTabs = [];
            if ($scope.selectedFoldersId == FOLDER_ITEM.ID_NULL) {
                $scope.reloadView();
            } else {

                let elem = $scope.folders.findTree($scope.folderTreeRoot.trees, $scope.selectedFoldersId);
                elem.children.forEach(unelem => {
                    $scope.openedFolderIds = $scope.openedFolderIds.filter((openFolderId) => openFolderId != unelem._id);
                })
                $scope.folders.setFolders(await folderService.getFolderChildren($scope.selectedFoldersId, $scope.isCheckedLabelShare, $scope.isCheckedLabelMy));

                elem.children = $scope.folders.mapToChildrenTrees();
                $scope.folders.setFakeFolder(elem.children);
                $scope.openedFolderIds = $scope.openedFolderIds.filter((openFolderId) => openFolderId != $scope.selectedFoldersId);

            }


        }

        $scope.deleteFolder = async (folders: FolderItem[]): Promise<void> => {
            let ids: string[] = folders.map(folder => folder._id)
            let name: string = "name"
            let folderBody: {} = {name, ids}
            try {
                await folderService.deleteFolder(folderBody);
                notify.success(lang.translate('mindmap.folder.delete.done'));
                await $scope.openTreeAndViewFolder();
                $scope.$apply();
            } catch (e) {
                notify.success(lang.translate('mindmap.folder.delete.fail'));
                throw(e);
            }
            $scope.$apply();
        };

        $scope.deleteMindmap = async (id: string): Promise<void> => {
            try {
                await mindmapService.deleteMindmap(id);
                notify.success(lang.translate('mindmap.delete.done'));
                template.open('mindmap', 'mindmap-list');
                await $scope.IsShare($scope.selectedFoldersId);
                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
            } catch (e) {
                notify.error(lang.translate('mindmap.delete.fail'));
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
            $scope.isCheckedLabelMy = true;
            $scope.isCheckedLabelShare = true;
            $scope.mindmap = new Mindmap();
            $scope.action = 'mindmap-create';
            template.open('mindmap', 'mindmap-create');
        };

        $scope.goto = function () {
            window.location.hash = '/';
        };

        $scope.createMindmap = async function (name: string, description: string, thumbnail: any): Promise<void> {
            let userId: string = model.me.userId;
            let folder_parent_id: string = $scope.selectedFoldersId;
            $scope.forceToClose = true;
            var mindmap: MindmapFolder;
            if ($scope.selectedFoldersId == FOLDER_ITEM.ID_NULL) {
                folder_parent_id = null;
            }
            let folder_parent: {} = [{userId, folder_parent_id}];
            mindmap = new MindmapFolder(name, folder_parent, description, thumbnail);

            try {
                await mindmapService.createMindmap(mindmap);
                $scope.cancelMindmapEdit();
                notify.success(lang.translate("mindmap.create.done"));
                template.open('mindmap', 'mindmap-list');
                await $scope.openFolderById($scope.selectedFoldersId, true, true);
                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
                $scope.isCheckedLabelMy = true;
                $scope.isCheckedLabelShare = true;
            } catch (e) {
                notify.error(lang.translate('mindmap.create.fail'));
                throw(e);
            }

        };

        $scope.duplicateMindmap = async function (mindmap: FolderItem): Promise<void> {
            let id: string = mindmap._id;
            let folderParentId: string = $scope.selectedFoldersId;
            try {
                await mindmapService.duplicateMindmap(id, folderParentId);
                notify.success(lang.translate("mindmap.duplicate.done"));
                template.open('mindmap', 'mindmap-list');
                await $scope.openFolderById($scope.selectedFoldersId, true, true);
                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
                $scope.isCheckedLabelMy = true;
                $scope.isCheckedLabelShare = true;
            } catch (e) {
                notify.error(lang.translate('mindmap.duplicate.fail'));
                throw(e);
            }
        }

        /**
         * Allows to save the current edited mindmap in the scope. After saving the
         * current mindmap this method closes the edit view too.
         */
        $scope.saveMindmap = async function () {
            $scope.forceToClose = true;
            $scope.master = angular.copy($scope.mindmap);
            await $scope.master.save();
            $scope.cancelMindmapEdit();
        };

        /**
         * Save the current mindmap in database
         */
        $scope.saveMap = async function () {
            $scope.master = angular.copy($scope.mindmap);
            await $scope.master.save();
            await $scope.master.save();
        };
        /**
         * Retrieve the mindmap thumbnail if there is one
         */
        $scope.getMindmapThumbnail = function (mindmap) {

        };
        /**
         * Open a mindmap in the wisemapping editor
         */
        $scope.openMindmap = function (mindmap) {
            $scope.selectedMindmapTabs = [];
            $scope.selectedFolderTabs = [];
            delete $scope.mindmap;
            delete $scope.selectedMindmap;
            $scope.notFound = false;

            template.close('main');
            template.close('mindmap');

            $timeout(function () {
                $scope.editorId = $scope.editorId + 1;
                $scope.mindmap = $scope.selectedMindmap = mindmap;
                mapAdapter.adapt($scope);
                $scope.action = 'mindmap-open';
                $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
                template.open('mindmap', 'mindmap-edit');
                window.location.hash = '/view/' + $scope.mindmap._id;
            });


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


            // Need to wait before opening a mindmap

            $timeout(function () {
                $scope.editorId = $scope.editorId + 1;
                $scope.mindmap = $scope.selectedMindmap = mindmap;
                mapAdapter.adapt($scope);
                $scope.action = 'mindmap-open';
                $("body").attr("style", "");
                $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
                template.open('mindmap', 'mindmap-print-png');
            });

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

            // Need to wait before opening a mindmap
            $timeout(function () {
                $scope.editorId = $scope.editorId + 1;
                $scope.mindmap = $scope.selectedMindmap = mindmap;
                mapAdapter.adapt($scope);
                $scope.action = 'mindmap-open';
                //$scope.mindmap.readOnly = model.me.hasRight(mindmap, Behaviours.applicationsBehaviours.mindmap.rights.resource.contrib);

                $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
                template.open('mindmap', 'mindmap-print');
            });

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
            $scope.forceToClose = false;
            $scope.selectedMindmapTabs = [];
            $scope.selectedFolderTabs = [];
            $scope.$apply();
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
            template.open('mindmap', 'mindmap-update');
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
        $scope.cancelRemoveMindmap = function (): void {
            delete $scope.display.confirmDeleteMindmap;
        };

        /**
         * Allows to remove the current mindmap in the scope.
         */
        $scope.removeMindmap = async (): Promise<void> => {
            _.map($scope.selectedMindmapTabs, async function (mindmap) {
                await mindmap.delete();

                template.open('mindmap', 'mindmap-list');
                await $scope.IsShare($scope.selectedFoldersId);
                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
                $scope.$apply();
            });


            $scope.display.confirmDeleteMindmap = false;
        };

        /**
         * Allows to open the "share" panel by setting the
         * "$scope.display.showPanel" variable to "true".
         * @param mindmap the mindmap to share.
         * @param event the current event.
         */
        $scope.shareMindmap = function (mindmap, event): void {
            $scope.mindmap = mindmap
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
            viewMindmap: async (): Promise<void> => {

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
            printMindmap: async (params): Promise<void> => {
                let m: Mindmap = await mindmapService.getMindmap(params.mindmapId);
                if (m) {
                    $scope.notFound = "false"
                    $scope.printMindmap(m, false);
                } else {
                    $scope.notFound = "true";
                    $scope.openMainPage();
                }
            },
            printPngMindmap: async (params): Promise<void> => {
                let m: Mindmap = await mindmapService.getMindmap(params.mindmapId);
                if (m) {
                    $scope.notFound = "false";
                    $scope.printPngMindmap(m, false);
                } else {
                    $scope.notFound = "true";
                    $scope.openMainPage();
                }
            },

            /**
             * Display the mindmap tree
             **/
            main: async (): Promise<void> => {
                delete $scope.mindmap;
                delete $scope.selectedMindmap;
                template.close('main');
                $scope.action = 'mindmap-list';
                template.open('mindmap', 'mindmap-list');
                ;
                $scope.selectedMindmapTabs = [];
                $scope.selectedFolderTabs = [];
                $scope.isCheckedLabelMy = true;
                $scope.isCheckedLabelShare = true;
                $scope.openedFolderIds = [];
                $scope.selectedFoldersId = FOLDER_ITEM.ID_NULL;
                await $scope.initFolder();
                $scope.$apply();
            },

        });
    }]);