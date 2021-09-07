import Search from '../utils/search';
import data from './data.json';
import { Validator } from 'jsonschema';

const v = new Validator();

const AddressModel = new Search();
AddressModel.import(data);

const AddressSchema = {
  "id": "/address",
  "type": "object",
  "properties": {
    "line1": {"type": "string", "minLength": 1 },
    "line2": {"type": "string",  "minimum": 1 },
    "city": {"type": "string",  "minLength": 2 },
    "state": {"type": "string",  "minLength": 2 },
    "zip": {"type": "string",  "minLength": 5 },
  },
  "required": ["line1", "city", "state", "zip"]
};

export default {
  GET: (req, res) => {
    const { query: { query } } = req;
    const isEmpty = query?.length ? query.replace(/\s/g,"") === '' : true;
    if (!query || isEmpty) {
      return res.send(AddressModel.db)
    } else {
      const results = AddressModel.query(query);
      res.send(results);
    }
  },

  POST: (req, res) => {
    const address = req.body;
    const validation = v.validate(address, AddressSchema);
    if (validation.valid) {
      const result = AddressModel.add(address);
      if (result.error) return res.status(403).send(result);

      res.status(200).send(result);

    } else {
      return res.status(403).send(validation.toString());
    }
  },

  PUT: (req, res) => {
    const { id } = req.params;
    const address = req.body;
    const validation = v.validate(address, AddressSchema);
    if (validation.valid) {
      const update = AddressModel.update(id, address);
      if (update.error) return res.status(403).send(update);

      return res.status(200).send(update);
      
    } else {
      return res.status(403).send(validation.toString());
    }
  },

  DELETE: (req, res) => {
    const { id } = req.params;
    const results = AddressModel.delete(id);

    if (results.error) return res.status(403).res.send(result);
    return res.status(200).send(results);
  }
};
