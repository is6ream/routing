import { serialize } from 'v8';
import {app} from './app'
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//express 03 27^00
//39:39