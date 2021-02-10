import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, View, Text, SafeAreaView, SectionList, Button, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData, TouchableOpacity } from 'react-native'
import { CheckBox } from 'react-native-elements'
import '@expo/match-media'
import { useMediaQuery } from "react-responsive"

const Adaptaki = () => {
  const [error, setError] = useState(null)
  const model = useSelector(store => store).model ?? {
    subject: 5,
    exam: 7,
    questions: []
  }
  const dispatch = useDispatch()

  const DATA = [
    {
      subject: "Вычисления",
      key: 1,
      data: [
        { theme: "Действия с дробями", key: 1, count: 38 },
        { theme: "Действия со степенями", key: 2, count: 44 },
      ]
    },
    {
      subject: "Про­стей­шие текстовые задачи",
      key: 3,
      data: [
        { theme: "Проценты, округление", key: 1, count: 57 },
      ]
    },
    //Преобразования выражений Действия с формулами · 54 шт.
    {
      subject: "Размеры и единицы измерения",
      key: 9,
      data: [
        { theme: "Единицы измерения времени", key: 1, count: 10 },
        { theme: "Единицы измерения длины", key: 2, count: 9 },
        { theme: "Единицы измерения массы", key: 3, count: 10 },
        { theme: "Единицы измерения объёма", key: 4, count: 10 },
        { theme: "Единицы измерения площади", key: 5, count: 10 },
        { theme: "Единицы измерения площади", key: 6, count: 10 },
      ]
    },
  ]

  const full = () => {
    dispatch({ type: 'model', value: { subject: 5, exam: 7 } })
  }

  const checkValueOld = (valueOld, e) => {
    if (isNaN(valueOld))
      valueOld = 0

    let value
    if (typeof e == "number") {
      value = valueOld + e
    }
    else {
      value = +e.nativeEvent.text
      e.target.value = null
    }
    if (!isNaN(value)) {
      if (value < 0)
        value = 0
    }
    return value
  }

  const sectionCount = (sectionKey) => {
    let result = ''
    if (!model.questions) // BAD
      model.questions = []
    model.questions.forEach(q => {
      if (q.num == sectionKey)
        result = q.count
    })
    return result
  }
  const sectionCountChanged = (sectionKey, e: NativeSyntheticEvent<TextInputSubmitEditingEventData> | number) => {
    let value = checkValueOld(+sectionCount(sectionKey), e)

    let q = model.questions.find(q => q.num == sectionKey)
    if (!q) {
      q = { num: sectionKey }
      model.questions.push(q)
    }
    q.count = value
    dispatch({ type: 'model', value: { subject: 5, exam: 7, questions: model.questions } })
  }

  const isThemeChecked = (sectionKey, themeKey) => {
    let result = ''
    model.questions.forEach(q => {
      if (q.num == sectionKey && q.themes)
        q.themes.forEach(theme => {
          if (theme.id == themeKey) {
            result = theme.count
          }
        })
    })
    return result
  }

  const findTheme = (sectionKey, themeKey) => {
    let result = { qOld: null, themeOld: -1 }
    model.questions.forEach(q => {
      if (q.num == sectionKey) {
        result.qOld = q
        if (q.themes)
          q.themes.forEach(theme => {
            if (theme.id == themeKey)
              result.themeOld = q.themes.indexOf(theme)
          })
        else
          q.themes = []
      }
    })
    return result
  }

  const newModelAfterThemeRechecked = (sectionKey, themeKey) => {
    let result = findTheme(sectionKey, themeKey)
    let qOld = result.qOld
    let themeOld = result.themeOld

    let newCount = 1
    let t = { id: themeKey, count: newCount }

    if (qOld) {
      if (themeOld == -1)
        qOld.themes.push(t)
      else {
        qOld.themes.splice(themeOld, 1)
        if (!qOld.themes.length) {
          delete qOld.themes
          model.questions.splice(model.questions.indexOf(qOld), 1)
        }
      }
    }
    else {
      model.questions.push({ num: sectionKey, themes: [t] })
    }

    return { subject: 5, exam: 7, questions: model.questions }
  }

  const themeCountChanged = (sectionKey, themeKey, e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    let result = findTheme(sectionKey, themeKey)
    let qOld = result.qOld
    let themeOld = result.themeOld

    let value = checkValueOld(+isThemeChecked(sectionKey, themeKey), e)

    let t = { id: themeKey, count: value }
    if (qOld) {
      if (themeOld == -1)
        qOld.themes.push(t)
      else {
        qOld.themes.splice(themeOld, 1)
        qOld.themes.push(t)
      }
    } else {
      model.questions.push({ num: sectionKey, themes: [t] })
    }
    dispatch({ type: 'model', value: { subject: 5, exam: 7, questions: model.questions } })
  }

  const But = (props) => (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled} >
      <Text style={[
        { backgroundColor: props.disabled ? 'lightgray' : 'gray' },
        { fontSize: props.fontSize ?? 24 },
        styles.button,
      ]}>{props.children}</Text></TouchableOpacity>
  )

  const Header = ({ section }) => (
    <View style={styles.headerrow}>
      <Text style={styles.header}>
        <Text style={{ fontStyle: 'italic' }}>{section.key + '. '}</Text>
        {section.subject}
      </Text>
      <But onPress={e => sectionCountChanged(section.key, -1)} disabled={!sectionCount(section.key)} >‒</But>
      <TextInput placeholder={sectionCount(section.key)+''}
        onSubmitEditing={e => sectionCountChanged(section.key, e)} style={styles.input} />
      <But onPress={e => sectionCountChanged(section.key, 1)} >+</But>
    </View>
  )
  const Theme = ({ e }) => (
    <View style={styles.headerrow}>
      <View style={styles.item}>
        <CheckBox title={e.item.theme} checked={isThemeChecked(e.section.key, e.item.key)!=0} containerStyle={{ padding: 0 }}
          onPress={() => dispatch({ type: 'model', value: newModelAfterThemeRechecked(e.section.key, e.item.key) })} />
        <Text style={styles.theme}></Text>
      </View>
      <But onPress={ev => themeCountChanged(e.section.key, e.item.key, -1)}
        disabled={!isThemeChecked(e.section.key, e.item.key)} fontSize={20}>‒</But>
      <TextInput placeholder={isThemeChecked(e.section.key, e.item.key)+''}
        onSubmitEditing={ev => themeCountChanged(e.section.key, e.item.key, ev)} style={styles.input} />
      <But onPress={ev => themeCountChanged(e.section.key, e.item.key, 1)}
        disabled={isThemeChecked(e.section.key, e.item.key) >= e.item.count} fontSize={20}>+</But>
      <Text style={{ fontSize: 12, marginLeft: 4 }}>{'из ' + e.item.count}</Text>
    </View>
  )

  const isLandscape = useMediaQuery({
    minDeviceWidth: 768,
  })

  return (
    <View>
      <View style={styles.row}>
        <View style={{ flex: 2, height: 45 }}>
          <Button onPress={full} disabled={!model.questions || !model.questions.length} title="сбросить выбор" />
        </View>
      </View>
      <View style={styles.row}>
        <SafeAreaView style={{ flex: 2, marginRight: 4 }}>
          <SectionList
            sections={DATA}
            renderSectionHeader={({ section }) => <Header section={section} />}
            renderItem={(e) => <Theme e={e} />}
          />
        </SafeAreaView>
        {isLandscape &&
          <View style={styles.container} >
            <Text style={{ fontSize: 24, borderWidth: 1 }}>{JSON.stringify(model)}</Text>
            <Button title='json to console' onPress={() => console.log(JSON.stringify(model))} />
          </View>
        }
      </View>
      {!isLandscape &&
        <View style={styles.container} >
          <Text style={{ fontSize: 24, borderWidth: 1 }}>{JSON.stringify(model)}</Text>
          <Button title='json to console' onPress={() => console.log(JSON.stringify(model))} />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  container: {
    flexBasis: '30%',
    marginRight: 2
  },

  headerrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  header: {
    fontSize: 24,
    flexBasis: '80%',
    marginLeft: 10,
    backgroundColor: "#e5e4ec",
  },
  item: {
    flexBasis: '70%',
    paddingHorizontal: 10,
    marginHorizontal: 8,
    backgroundColor: "#e4f1ea",
  },
  theme: {
    //margin: 0,
    fontSize: 18,
  },

  button: {
    borderRadius: 5,
    textAlign: 'center',
    color: 'white',
    width: 24,
    justifyContent: 'center',
  },
  input: {
    width: 45,
    justifyContent: 'center',
    textAlign: 'center',
    padding: 5,
    fontSize: 16,
  },
})

export default Adaptaki