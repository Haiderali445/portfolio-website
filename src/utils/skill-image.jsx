// Local SVG Imports
import adobeXd from '../assets/svg/skills/adobe-xd.svg';
import adobeaudition from '../assets/svg/skills/adobeaudition.svg';
import afterEffects from '../assets/svg/skills/after-effects.svg';
import angular from '../assets/svg/skills/angular.svg';
import aws from '../assets/svg/skills/aws.svg';
import azure from '../assets/svg/skills/azure.svg';
import blender from '../assets/svg/skills/blender.svg';
import bootstrap from '../assets/svg/skills/bootstrap.svg';
import bulma from '../assets/svg/skills/bulma.svg';
import c from '../assets/svg/skills/c.svg';
import canva from '../assets/svg/skills/canva.svg';
import capacitorjs from '../assets/svg/skills/capacitorjs.svg';
import coffeescript from '../assets/svg/skills/coffeescript.svg';
import cplusplus from '../assets/svg/skills/cplusplus.svg';
import csharp from '../assets/svg/skills/csharp.svg';
import css from '../assets/svg/skills/css.svg';
import dart from '../assets/svg/skills/dart.svg';
import deno from '../assets/svg/skills/deno.svg';
import django from '../assets/svg/skills/django.svg';
import docker from '../assets/svg/skills/docker.svg';
import fastify from '../assets/svg/skills/fastify.svg';
import figma from '../assets/svg/skills/figma.svg';
import firebase from '../assets/svg/skills/firebase.svg';
import flutter from '../assets/svg/skills/flutter.svg';
import gcp from '../assets/svg/skills/gcp.svg';
import gimp from '../assets/svg/skills/gimp.svg';
import git from '../assets/svg/skills/git.svg';
import go from '../assets/svg/skills/go.svg';
import graphql from '../assets/svg/skills/graphql.svg';
import haxe from '../assets/svg/skills/haxe.svg';
import html from '../assets/svg/skills/html.svg';
import illustrator from '../assets/svg/skills/illustrator.svg';
import ionic from '../assets/svg/skills/ionic.svg';
import java from '../assets/svg/skills/java.svg';
import javascript from '../assets/svg/skills/javascript.svg';
import julia from '../assets/svg/skills/julia.svg';
import kotlin from '../assets/svg/skills/kotlin.svg';
import lightroom from '../assets/svg/skills/lightroom.svg';
import markdown from '../assets/svg/skills/markdown.svg';
import materialui from '../assets/svg/skills/materialui.svg';
import matlab from '../assets/svg/skills/matlab.svg';
import memsql from '../assets/svg/skills/memsql.svg';
import microsoftoffice from '../assets/svg/skills/microsoftoffice.svg';
import mongoDB from '../assets/svg/skills/mongoDB.svg';
import mysql from '../assets/svg/skills/mysql.svg';
import nextJS from '../assets/svg/skills/nextJS.svg';
import nginx from '../assets/svg/skills/nginx.svg';
import numpy from '../assets/svg/skills/numpy.svg';
import nuxtJS from '../assets/svg/skills/nuxtJS.svg';
import opencv from '../assets/svg/skills/opencv.svg';
import photoshop from '../assets/svg/skills/photoshop.svg';
import php from '../assets/svg/skills/php.svg';
import picsart from '../assets/svg/skills/picsart.svg';
import postgresql from '../assets/svg/skills/postgresql.svg';
import premierepro from '../assets/svg/skills/premierepro.svg';
import prisma from '../assets/svg/skills/prisma.svg';
import python from '../assets/svg/skills/python.svg';
import pytorch from '../assets/svg/skills/pytorch.svg';
import react from '../assets/svg/skills/react.svg';
import ruby from '../assets/svg/skills/ruby.svg';
import selenium from '../assets/svg/skills/selenium.svg';
import sketch from '../assets/svg/skills/sketch.svg';
import strapi from '../assets/svg/skills/strapi.svg';
import svelte from '../assets/svg/skills/svelte.svg';
import swift from '../assets/svg/skills/swift.svg';
import tailwind from '../assets/svg/skills/tailwind.svg';
import tensorflow from '../assets/svg/skills/tensorflow.svg';
import typescript from '../assets/svg/skills/typescript.svg';
import unity from '../assets/svg/skills/unity.svg';
import vitejs from '../assets/svg/skills/vitejs.svg';
import vue from '../assets/svg/skills/vue.svg';
import vuetifyjs from '../assets/svg/skills/vuetifyjs.svg';
import webix from '../assets/svg/skills/webix.svg';
import wolframalpha from '../assets/svg/skills/wolframalpha.svg';
import wordpress from '../assets/svg/skills/wordpress.svg';
import pandas from '../assets/svg/skills/pandas.svg';
import scikitlearn from '../assets/svg/skills/scikit-learn.svg';
import dotnet from '../assets/svg/skills/dotnet.svg';
import dotnetcore from '../assets/svg/skills/dotnetcore.svg';
import kubernetes from '../assets/svg/skills/kubernetes.svg';
import linux from '../assets/svg/skills/linux.svg';
import sqlalchemy from '../assets/svg/skills/sqlalchemy.svg';
import fastapi from '../assets/svg/skills/fastapi.svg';

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
