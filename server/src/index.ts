import express from 'express';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import agoraRouter from './routes/agora';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/health', healthRouter);
app.use('/agora', agoraRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
