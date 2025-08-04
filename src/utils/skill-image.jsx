// Local SVG Imports
import adobeXd from '../Assets/svg/skills/adobe-xd.svg';
import adobeaudition from '../Assets/svg/skills/adobeaudition.svg';
import afterEffects from '../Assets/svg/skills/after-effects.svg';
import angular from '../Assets/svg/skills/angular.svg';
import aws from '../Assets/svg/skills/aws.svg';
import azure from '../Assets/svg/skills/azure.svg';
import blender from '../Assets/svg/skills/blender.svg';
import bootstrap from '../Assets/svg/skills/bootstrap.svg';
import bulma from '../Assets/svg/skills/bulma.svg';
import c from '../Assets/svg/skills/c.svg';
import canva from '../Assets/svg/skills/canva.svg';
import capacitorjs from '../Assets/svg/skills/capacitorjs.svg';
import coffeescript from '../Assets/svg/skills/coffeescript.svg';
import cplusplus from '../Assets/svg/skills/cplusplus.svg';
import csharp from '../Assets/svg/skills/csharp.svg';
import css from '../Assets/svg/skills/css.svg';
import dart from '../Assets/svg/skills/dart.svg';
import deno from '../Assets/svg/skills/deno.svg';
import django from '../Assets/svg/skills/django.svg';
import docker from '../Assets/svg/skills/docker.svg';
import fastify from '../Assets/svg/skills/fastify.svg';
import figma from '../Assets/svg/skills/figma.svg';
import firebase from '../Assets/svg/skills/firebase.svg';
import flutter from '../Assets/svg/skills/flutter.svg';
import gcp from '../Assets/svg/skills/gcp.svg';
import gimp from '../Assets/svg/skills/gimp.svg';
import git from '../Assets/svg/skills/git.svg';
import go from '../Assets/svg/skills/go.svg';
import graphql from '../Assets/svg/skills/graphql.svg';
import haxe from '../Assets/svg/skills/haxe.svg';
import html from '../Assets/svg/skills/html.svg';
import illustrator from '../Assets/svg/skills/illustrator.svg';
import ionic from '../Assets/svg/skills/ionic.svg';
import java from '../Assets/svg/skills/java.svg';
import javascript from '../Assets/svg/skills/javascript.svg';
import julia from '../Assets/svg/skills/julia.svg';
import kotlin from '../Assets/svg/skills/kotlin.svg';
import lightroom from '../Assets/svg/skills/lightroom.svg';
import markdown from '../Assets/svg/skills/markdown.svg';
import materialui from '../Assets/svg/skills/materialui.svg';
import matlab from '../Assets/svg/skills/matlab.svg';
import memsql from '../Assets/svg/skills/memsql.svg';
import microsoftoffice from '../Assets/svg/skills/microsoftoffice.svg';
import mongoDB from '../Assets/svg/skills/mongoDB.svg';
import mysql from '../Assets/svg/skills/mysql.svg';
import nextJS from '../Assets/svg/skills/nextJS.svg';
import nginx from '../Assets/svg/skills/nginx.svg';
import numpy from '../Assets/svg/skills/numpy.svg';
import nuxtJS from '../Assets/svg/skills/nuxtJS.svg';
import opencv from '../Assets/svg/skills/opencv.svg';
import photoshop from '../Assets/svg/skills/photoshop.svg';
import php from '../Assets/svg/skills/php.svg';
import picsart from '../Assets/svg/skills/picsart.svg';
import postgresql from '../Assets/svg/skills/postgresql.svg';
import premierepro from '../Assets/svg/skills/premierepro.svg';
import prisma from '../Assets/svg/skills/prisma.svg';
import python from '../Assets/svg/skills/python.svg';
import pytorch from '../Assets/svg/skills/pytorch.svg';
import react from '../Assets/svg/skills/react.svg';
import ruby from '../Assets/svg/skills/ruby.svg';
import selenium from '../Assets/svg/skills/selenium.svg';
import sketch from '../Assets/svg/skills/sketch.svg';
import strapi from '../Assets/svg/skills/strapi.svg';
import svelte from '../Assets/svg/skills/svelte.svg';
import swift from '../Assets/svg/skills/swift.svg';
import tailwind from '../Assets/svg/skills/tailwind.svg';
import tensorflow from '../Assets/svg/skills/tensorflow.svg';
import typescript from '../Assets/svg/skills/typescript.svg';
import unity from '../Assets/svg/skills/unity.svg';
import vitejs from '../Assets/svg/skills/vitejs.svg';
import vue from '../Assets/svg/skills/vue.svg';
import vuetifyjs from '../Assets/svg/skills/vuetifyjs.svg';
import webix from '../Assets/svg/skills/webix.svg';
import wolframalpha from '../Assets/svg/skills/wolframalpha.svg';
import wordpress from '../Assets/svg/skills/wordpress.svg';
import pandas from '../Assets/svg/skills/pandas.svg';
import scikitlearn from '../Assets/svg/skills/scikit-learn.svg';
import dotnet from '../Assets/svg/skills/dotnet.svg';
import dotnetcore from '../Assets/svg/skills/dotnetcore.svg';
import kubernetes from '../Assets/svg/skills/kubernetes.svg';
import linux from '../Assets/svg/skills/linux.svg';
import sqlalchemy from '../Assets/svg/skills/sqlalchemy.svg';
import fastapi from '../Assets/svg/skills/fastapi.svg';

// External URLs for missing icons
const skillMap = {
  // 🔸 Local imports
  'adobe xd': adobeXd,
  'adobe audition': adobeaudition,
  'after effects': afterEffects,
  angular,
  aws,
  azure,
  blender,
  bootstrap,
  bulma,
  c,
  canva,
  capacitorjs,
  coffeescript,
  'c++': cplusplus,
  'c#': csharp,
  css,
  dart,
  deno,
  django,
  docker,
  fastify,
  figma,
  firebase,
  flutter,
  gcp,
  gimp,
  git,
  go,
  graphql,
  haxe,
  html,
  illustrator,
  ionic,
  java,
  javascript,
  julia,
  kotlin,
  lightroom,
  markdown,
  materialui,
  matlab,
  memsql,
  'microsoft office': microsoftoffice,
  mongodb: mongoDB,
  mysql,
  'next js': nextJS, // Local asset
  nginx,
  numpy,
  'nuxt js': nuxtJS,
  opencv,
  photoshop,
  php,
  picsart,
  postgresql,
  'premiere pro': premierepro,
  prisma,
  python,
  pytorch,
  react,
  ruby,
  selenium,
  sketch,
  strapi,
  svelte,
  swift,
  tailwind,
  tensorflow,
  typescript,
  unity,
  vitejs,
  vue,
  vuetifyjs,
  webix,
  wolframalpha,
  wordpress,
  pandas,
  sklearn: scikitlearn,
  '.net': dotnet,
  '.net core': dotnetcore,
  kubernetes,
  linux,
  sqlalchemy,
  fastapi,

  // 🔹 External SVG links
  redux:         'https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg',
  'node.js':     'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
  express:       'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg',
  'vs code':     'https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg',
  netlify:       'https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg',
  vercel:        'https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg',
  notion:        'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
  trello:        'https://www.vectorlogo.zone/logos/trello/trello-icon.svg',
  jira:          'https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg',
  sql:           'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
  github:        'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg',
  'github actions': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg',
  postman:       'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
  'scikit-learn':'https://raw.githubusercontent.com/scikit-learn/scikit-learn/main/doc/logos/scikit-learn-logo-without-subtitle.svg',
  'next.js':     'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg',
};




export const skillsImage = (skill) => {
  if (!skill) return null;
  const key = skill.toLowerCase();
  return skillMap[key] || null; // optionally return a placeholder icon
};
