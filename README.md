# vue-workspace vue 工作区项目

## 快速开始

```shell
#安装依赖
yarn install

# 运行
yarn dev:home #运行门户
yarn dev:admin #运行管理端

#打包
yarn build   #打包所有
yarn build:home  #打包门户
yarn build:admin #打包管理端
```

## 工作区

```
能够共享的包就安装到根
工作空间独立的就单独安装到工作区
添加到根
yarn add cross-env -D -W
删除根
yarn remove cross-env  -W

如果想单独添加或者移除某个子项目的依赖，可以使用如下命令：
yarn workspace <workspace_name > add <pkg_name> --dev
yarn workspace <workspace_name > remove <pkg_name>

注意： workspace_name workspace_name 包名，package.json 中设置的 name，不是文件夹名

比如
yarn workspace @project/home add  swiper
yarn workspace @project/admin add  swiper

yarn workspace @project/home add react-custom-scrollbars

```
