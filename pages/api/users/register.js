import nc from "next-connect";
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../utils/config';
import { signToken } from "../../../utils/auth";
import { client } from '../../../lib/client';

const handler = nc();

handler.post(async (req, res) => {

    console.log(
        req.body.name,
        req.body.email,
        req.body.password
    )
    const projectId = config.projectId;
    console.log(projectId);
    const dataset = config.dataset;
    console.log(dataset);
    const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
    const createMutations = [
        {
            create: {
                _type: 'user',
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password),
                isAdmin: false,
            },
        },
    ];

    const existUser = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        {
        email: req.body.email,
        }
    );
  
    if (existUser) {
        return res.status(401).send({ message: 'Email already exists' });
    }
  
    const { data } = await axios.post(
        `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
        { mutations: createMutations },
        {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
        }
    );
    
    const userId = data.results[0].id;
    const user = {
        _id: userId,
        name: req.body.name,
        email: req.body.email,
        isAdmin: false,
    };
    
    console.log(user);
    
    const token = signToken(user);
    
    res.send({ ...user, token });
});

export default handler;