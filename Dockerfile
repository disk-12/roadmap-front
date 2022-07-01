# 真面目に書け
FROM node:16
COPY . .
ENV PORT 3000
ENV HOST 0.0.0.0
RUN yarn
RUN yarn build
CMD ["yarn", "start"]