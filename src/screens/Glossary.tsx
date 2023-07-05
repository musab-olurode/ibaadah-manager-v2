import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import Input from '../components/Input';
import {GlobalColors, globalStyles, normalizeFont} from '../styles/global';
import SearchIconImg from '../assets/icons/search.svg';
import {GlossaryItem, Theme} from '../types/global';
import {ORDERED_GLOSSARY} from '../utils/glossary';
import {Modal} from 'native-base';
import Button from '../components/Button';
import {useTranslation} from 'react-i18next';
import usePreferredTheme from '../hooks/usePreferredTheme';

const Glossary = () => {
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<GlossaryItem>();
  const [glossaryItems, setGlossaryItems] =
    useState<GlossaryItem[]>(ORDERED_GLOSSARY);
  const searchInputRef = useRef<TextInput | null>(null);
  const {t} = useTranslation();
  const preferredTheme = usePreferredTheme();

  const handleOnPressSearchInputIcon = () => {
    searchInputRef.current?.focus();
  };

  const handleOnSearchInputFocus = (isFocused: boolean) => {
    setIsSearchInputFocused(isFocused);
  };

  const handleOnPressGlossaryItem = (glossaryItem: GlossaryItem) => {
    setSelectedWord(glossaryItem);
    setModalVisible(true);
  };

  const renderItem = ({item}: {item: GlossaryItem}) => (
    <Pressable
      onPress={() => handleOnPressGlossaryItem(item)}
      style={styles.item}>
      <Text
        style={[
          styles.word,
          preferredTheme === Theme.DARK && globalStyles.darkModeText,
        ]}>
        {'\u2022'}
      </Text>
      <Text
        style={[
          styles.itemText,
          styles.word,
          preferredTheme === Theme.DARK && globalStyles.darkModeText,
        ]}>
        {item.name}
      </Text>
    </Pressable>
  );

  const handleOnTypeSearchInput = (text: string) => {
    if (text) {
      const filteredGlossary = ORDERED_GLOSSARY.filter(glossaryItem =>
        glossaryItem.slug.toLowerCase().includes(text.toLowerCase()),
      );
      setGlossaryItems(filteredGlossary);
    } else {
      setGlossaryItems(ORDERED_GLOSSARY);
    }
  };

  const handleOnPressOkay = () => {
    setSelectedWord(undefined);
    setModalVisible(false);
  };

  return (
    <View
      style={[
        globalStyles.container,
        styles.container,
        preferredTheme === Theme.DARK && globalStyles.darkModeContainer,
      ]}>
      <View style={styles.searchInputContainer}>
        {!isSearchInputFocused && (
          <Pressable
            style={styles.searchInputIcon}
            onPress={handleOnPressSearchInputIcon}>
            <SearchIconImg />
          </Pressable>
        )}
        <Input
          isDarkMode={preferredTheme === Theme.DARK}
          innerRef={searchInputRef}
          placeholder={t('common:searchHere') as string}
          style={[
            styles.searchInput,
            preferredTheme === Theme.DARK && globalStyles.darkModeOverlay,
          ]}
          onChangeText={handleOnTypeSearchInput}
          onFocus={() => handleOnSearchInputFocus(true)}
          onEndEditing={() => handleOnSearchInputFocus(false)}
        />
      </View>
      <Modal isOpen={modalVisible} avoidKeyboard>
        <Modal.Content
          borderRadius={0}
          backgroundColor={
            preferredTheme === Theme.DARK
              ? GlobalColors.darkModeOverlay
              : undefined
          }>
          <View style={styles.modalBody}>
            <Text
              style={[
                globalStyles.text,
                preferredTheme === Theme.DARK && globalStyles.darkModeText,
              ]}>
              {selectedWord?.name}
            </Text>
            <View
              style={[
                styles.definitionContainer,
                preferredTheme === Theme.DARK && globalStyles.darkModeOverlay,
              ]}>
              <Text
                style={[
                  styles.definitionText,
                  preferredTheme === Theme.DARK && globalStyles.darkModeText,
                ]}>
                {selectedWord?.explanation}
              </Text>
            </View>
            <Button
              text={t('common:okay') as string}
              variant="solid"
              style={styles.okayBtn}
              onPress={handleOnPressOkay}
            />
          </View>
        </Modal.Content>
      </Modal>
      <FlatList
        style={styles.list}
        data={glossaryItems}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchInputIcon: {
    position: 'absolute',
    left: '30%',
    zIndex: 2,
  },
  searchInput: {
    height: 40,
    textAlign: 'center',
  },
  list: {
    marginTop: 32,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  word: {
    ...globalStyles.text,
    color: GlobalColors.gray,
    fontSize: normalizeFont(20),
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
  },
  modalBody: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 49,
    paddingHorizontal: 16,
  },
  definitionContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 32,
  },
  definitionText: {
    ...globalStyles.text,
    color: GlobalColors.gray,
    fontSize: normalizeFont(14),
  },
  okayBtn: {
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
});

export default Glossary;
