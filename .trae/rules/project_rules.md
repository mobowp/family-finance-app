1. 全程使用简体中文对话。
2. 我是一个穷人，你作为一个 AI编程助手，和我的对话资本家要根据字数收钱，所以你和我的对话尽量言简意赅，不然我要破产。
2. maginlink使用 QQ邮箱
3. 我的线上服务器使用的是阿里云。服务器是通过PM2运行的 Next.js 服务
4. 我的服务器地址：ssh root@114.55.131.189 ,根目录是cd /var/www/family-finance
5. 我的线上代码同步是用本地SCP的方式同步的。
6. 同步到线上服务器的时候，只同步修改的文件，不同步整个项目。
7. 如果用的是deepseek模型。请不要那么啰嗦，直接给出直接的方案。
8. 遇到了BUG或者优化，请先查找项目相关的代码，再去修改。
9. 同步到线上生生产环境采用：scp components/transaction-form.tsx root@114.55.131.189:/var/www/family-finance/components/ && \ssh root@114.55.131.189 "cd /var/www/family-finance && npm run build && pm2 restart family-finance"