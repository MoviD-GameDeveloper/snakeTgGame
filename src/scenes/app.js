const tg = window.Telegram.WebApp;

// Показываем кнопку "Закрыть"
tg.MainButton.show();
tg.MainButton.setText("Закрыть");
tg.MainButton.onClick(() => tg.close());

// Отправка данных в Telegram
tg.sendData("Данные из Mini App");