import {GlossaryItem} from '../types/global';
import GLOSSARY_DATA from '../assets/data/glossary.json';

export const GLOSSARY: GlossaryItem[] = GLOSSARY_DATA;

export const ORDERED_GLOSSARY = GLOSSARY.sort((a, b) =>
  a.slug.localeCompare(b.slug),
);
