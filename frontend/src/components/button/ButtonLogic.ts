interface RouterActions {
  back: () => void;
  push: (path: string) => void;
}

export const buttonActions = {
  goBack: (router: RouterActions) => {
    router.back();
  },

  navigateTo: (router: RouterActions, path: string) => {
    router.push(path);
  },

  confirmDelete(
    callback: () => void,
    message: string = "Yakin ingin menghapus data ini?",
  ) {
    if (window.confirm(message)) {
      callback();
    }
  },
};
