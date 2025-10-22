'use client';

import { useState, useCallback } from 'react';

export const useModal = () => {
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openNewModal = useCallback((item = null) => {
        setSelectedItem(item);
        setIsNewModalOpen(true);
    }, []);

    const closeNewModal = useCallback(() => {
        setIsNewModalOpen(false);
        setSelectedItem(null);
    }, []);

    const openEditModal = useCallback((item) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedItem(null);
    }, []);

    const openDeleteModal = useCallback((item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
    }, []);

    return {
        isNewModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,
        selectedItem,
        openNewModal,
        closeNewModal,
        openEditModal,
        closeEditModal,
        openDeleteModal,
        closeDeleteModal,
    };
};
