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
import {GlossaryItem} from '../types/global';
import {ORDERED_GLOSSARY} from '../utils/glossary';
import {Modal} from 'native-base';
import Button from '../components/Button';

const Glossary = () => {
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<GlossaryItem>();
  const searchInputRef = useRef<TextInput | null>(null);

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
      <Text style={styles.word}>{'\u2022'}</Text>
      <Text style={[styles.itemText, styles.word]}>{item.word}</Text>
    </Pressable>
  );

  const handleOnPressOkay = () => {
    setSelectedWord(undefined);
    setModalVisible(false);
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.searchInputContainer}>
        {!isSearchInputFocused && (
          <Pressable
            style={styles.searchInputIcon}
            onPress={handleOnPressSearchInputIcon}>
            <SearchIconImg />
          </Pressable>
        )}
        <Input
          innerRef={searchInputRef}
          placeholder="Search here"
          style={styles.searchInput}
          onFocus={() => handleOnSearchInputFocus(true)}
          onEndEditing={() => handleOnSearchInputFocus(false)}
        />
      </View>
      <Modal isOpen={modalVisible} avoidKeyboard>
        <Modal.Content>
          <View style={styles.modalBody}>
            <Text style={globalStyles.text}>{selectedWord?.word}</Text>
            <View style={styles.definitionContainer}>
              <Text style={styles.definitionText}>
                {selectedWord?.definition}
              </Text>
            </View>
            <Button
              text="Okay"
              variant="solid"
              style={styles.okayBtn}
              onPress={handleOnPressOkay}
            />
          </View>
        </Modal.Content>
      </Modal>
      <FlatList
        style={styles.list}
        data={ORDERED_GLOSSARY}
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
