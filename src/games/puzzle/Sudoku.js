import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../theme/styles';

export default function Sudoku({ zh }) {
  const puzzle = [
    [1, 0, 0, 4],
    [0, 4, 1, 0],
    [2, 0, 4, 0],
    [0, 3, 0, 1],
  ];

  const solution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ];

  const [board, setBoard] = useState(
    puzzle.map(row => [...row])
  );
  const [selected, setSelected] = useState(null);

  const chooseNumber = number => {
    if (!selected) return;

    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;

    const next = board.map(row => [...row]);
    next[r][c] = number;
    setBoard(next);
  };

  const check = () => {
    const correct = board.every((row, r) =>
      row.every((value, c) => value === solution[r][c])
    );

    Alert.alert(
      zh ? '檢查結果' : 'Result',
      correct
        ? (zh ? '答對了！太棒了！🎉' : 'Correct! Great job! 🎉')
        : (zh ? '還有錯誤，再試試看！' : 'Not quite. Try again!')
    );
  };

  return (
    <View>
      <Text style={styles.instruction}>
        {zh
          ? '填入 1～4，每一列和每一行都不能重複。'
          : 'Fill in 1–4. No repeats in each row or column.'}
      </Text>

      <View style={styles.board}>
        {board.map((row, r) =>
          row.map((value, c) => (
            <TouchableOpacity
              key={`${r}-${c}`}
              style={[
                styles.sudokuCell,
                selected?.[0] === r && selected?.[1] === c
                  ? styles.selected
                  : null,
                puzzle[r][c] !== 0 && styles.fixedCell,
              ]}
              onPress={() => setSelected([r, c])}
            >
              <Text style={styles.number}>{value || ''}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.numberRow}>
        {[1, 2, 3, 4].map(n => (
          <TouchableOpacity
            key={n}
            style={styles.numberButton}
            onPress={() => chooseNumber(n)}
          >
            <Text style={styles.number}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.action} onPress={check}>
        <Text style={styles.actionText}>
          {zh ? '檢查答案' : 'Check Answer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryAction}
        onPress={() => {
          setBoard(puzzle.map(row => [...row]));
          setSelected(null);
        }}
      >
        <Text style={styles.secondaryText}>
          {zh ? '重新開始' : 'Restart'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
