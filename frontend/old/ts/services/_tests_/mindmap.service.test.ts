import MockAdapter from "axios-mock-adapter";
import {mindmapService} from "../mindmap.service";
import axios from 'axios';


describe('mindmapService', () => {
   it('returns data when duplicateMindmap request is correctly called', done => {
      const mock = new MockAdapter(axios);
       const id = 'id';
       const folderParentId = 'folderParentId';
       const data = {response: true};
       mock.onPost(`/mindmap/${id}/duplicate?folderTarget=${folderParentId}`)
           .reply(200, data);

       mindmapService.duplicateMindmap(id, folderParentId).then(response => {
           expect(response.data).toEqual(data);
           done();
       });
   });
});