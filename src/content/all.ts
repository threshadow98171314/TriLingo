// 一次載入全部語言的課程（同步）。只給測試和工具用：
// App 裡請用 index.ts 的 loadCourse／useCourse，引用這個檔案會讓所有題目又被打包進主程式。
import type { Course, LangId } from '../core/types';
import * as en from './en';
import { assemble } from './index';
import * as ja from './ja';
import * as ko from './ko';

export const COURSES: Record<LangId, Course> = {
  en: assemble('en', en),
  ja: assemble('ja', ja),
  ko: assemble('ko', ko),
};
export const COURSE_LIST: Course[] = [COURSES.en, COURSES.ja, COURSES.ko];
