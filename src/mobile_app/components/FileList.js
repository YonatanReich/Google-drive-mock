import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FileItem from './FileItem';
import { getStyles } from '../styles/fileList.styles';
import { useTheme } from '../hooks/useThemeColor';

export default function FileList({ data, onMenuPress, onFilePress }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [sortMode, setSortMode] = useState('date'); // date or name
    const [viewMode, setViewMode] = useState('list'); // list or grid

    const sortedData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;
            return sortMode === 'name'
                ? a.name.localeCompare(b.name)
                : new Date(b.dateOfCreation) - new Date(a.dateOfCreation);
        });
    }, [data, sortMode]);

    const toggleSort = () => { setSortMode(prev => (prev === 'name' ? 'date' : 'name')); };
    const toggleView = () => setViewMode(prev => (prev === 'list' ? 'grid' : 'list'));

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Feather name="folder-minus" size={64} color={theme.icon + '4D'} />
            <Text style={styles.emptyText}>No files here yet</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Pressable onPress={toggleSort} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerText}>
                        {sortMode === 'name' ? 'Name' : 'Last modified'}
                    </Text>
                    <View style={{ marginLeft: 8 }}>
                        <Feather
                            name={sortMode === 'name' ? "arrow-down" : "clock"}
                            size={14}
                            color={theme.icon}
                        />
                    </View>
                </Pressable>
                <Pressable onPress={toggleView} style={{ padding: 4 }}>
                    <Feather
                        name={viewMode === 'list' ? "grid" : "list"}
                        size={20}
                        color={theme.icon}
                    />
                </Pressable>
            </View>

            <FlatList
                key={viewMode}

                data={sortedData}
                numColumns={viewMode === 'list' ? 1 : 3}
                columnWrapperStyle={viewMode === 'grid' ? {
                    justifyContent: 'flex-start',
                    paddingHorizontal: 8
                } : null}

                keyExtractor={(item) => (item.id || item._id || Math.random().toString())}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={EmptyState}
                renderItem={({ item }) => (
                    <FileItem
                        name={item.name}
                        isFolder={item.isFolder}
                        viewMode={viewMode}
                        onPress={() => onFilePress?.(item)}
                        onMenuPress={() => onMenuPress(item)}
                    />
                )}
            />
        </View>
    );
}