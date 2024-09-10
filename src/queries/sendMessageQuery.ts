import { FileUpload, MessageType } from '@/components/Bot';
import { sendRequest } from '@/utils/index';
import dotenv from 'dotenv';

dotenv.config();

export type IncomingInput = {
  question: string;
  history: MessageType[];
  uploads?: FileUpload[];
  overrideConfig?: Record<string, unknown>;
  socketIOClientId?: string;
  chatId?: string;
  fileName?: string; // Only for assistant
};

export type MessageRequest = {
  apiKey?: string;
  apiHost?: string;
  body?: IncomingInput;
};

export type FeedbackRatingType = 'THUMBS_UP' | 'THUMBS_DOWN';

export type FeedbackInput = {
  chatId: string;
  messageId: string;
  rating: FeedbackRatingType;
  content?: string;
};

export type CreateFeedbackRequest = {
  chatflowid?: string;
  apiHost?: string;
  body?: FeedbackInput;
};

export type UpdateFeedbackRequest = {
  id: string;
  apiHost?: string;
  body?: Partial<FeedbackInput>;
};

export type RequestOptions = {
  method: string;
  url: string;
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  type?: string;
};

export const sendFeedbackQuery = ({ apiHost = 'http://localhost:8080', body }: CreateFeedbackRequest) =>
  sendRequest({
    method: 'POST',
    url: `${apiHost}/api/v1/feedback/}`,
    body,
  });

export const updateFeedbackQuery = ({ id, apiHost = 'http://localhost:8080', body }: UpdateFeedbackRequest) =>
  sendRequest({
    method: 'PUT',
    url: `${apiHost}/api/v1/feedback/${id}`,
    body,
  });

export const sendMessageQuery = ({ apiHost = 'http://localhost:8080', apiKey = process.env.API_KEY, body }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/prediction`,
    headers: {
      'X-API-KEY': apiKey,
    },
    body,
  } as RequestOptions);

export const getChatbotConfig = ({ apiHost = 'http://localhost:8080' }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/public-chatbotConfig/`,
  });

export const isStreamAvailableQuery = ({ apiHost = 'http://localhost:8080' }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/chatflows-streaming/`,
  });

export const sendFileDownloadQuery = ({ apiHost = 'http://localhost:8080', body }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/openai-assistants-file`,
    body,
    type: 'blob',
  });
