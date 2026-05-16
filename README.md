# Bot Tin Nhắn Ghim Discord

[![Giấy phép](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Giới thiệu

Bot này tự động gửi tin nhắn ghim sau một số lượng tin nhắn nhất định trong kênh Discord.

## Hỗ trợ

- Chỉ hỗ trợ các lỗi xảy ra trong quá trình chạy mã.

- Không hỗ trợ các vấn đề cài đặt.

- Mã nguồn sẽ được cập nhật với các bản phát hành thư viện chính khi cần thiết.

## Đóng góp

- Hoan nghênh các yêu cầu kéo (pull request) để sửa lỗi, lỗi chính tả hoặc lỗi ngữ pháp.

- Đối với các tính năng mới, vui lòng sao chép kho lưu trữ (fork).

## Yêu cầu

- [Node.js](https://nodejs.org) phiên bản 14 trở lên

- NPM (đã bao gồm trong Node.js) hoặc [Yarn](https://yarnpkg.com)

**Lưu ý:** Nếu bạn sử dụng NPM, hãy xóa tệp `yarn.lock`.

## Bắt đầu

1. Sao chép hoặc [tải xuống](https://github.com/itz_princeyt336/discord-sticky-message-bot/releases) kho lưu trữ này.

2. Điều hướng đến thư mục nơi bạn đã sao chép hoặc tải xuống kho lưu trữ.

3. Chạy `npm install` hoặc `yarn install` tùy thuộc vào trình quản lý gói của bạn.
4. Đổi tên tệp `.env.example` thành `.env` và điền các thông tin cần thiết:

```env

DISCORD_TOKEN=(mã token của bot)

MAX_MESSAGE_COUNT=(số lượng tin nhắn trước khi bot gửi lại tin nhắn ghim, tối thiểu 5 để tuân thủ Điều khoản dịch vụ của Discord)

OWNER=(ID người dùng của bạn hoặc ID người dùng khác, ví dụ: chủ sở hữu máy chủ)

``` 5. Khởi chạy bot bằng lệnh `node index.js`.

## Cách sử dụng

```
/stick <tin nhắn bạn muốn ghim>

/unstick <kênh>

/ping

/list
/info
```

## Các thư viện được sử dụng

- [Discord.js](https://github.com/discordjs/discord.js)

- [dotenv](https://github.com/motdotla/dotenv)

- [ESLint](https://github.com/eslint/eslint) (phụ thuộc phát triển)

## Giấy phép

Dự án này được cấp phép theo Giấy phép GPLv3. Xem tệp [LICENSE](https://www.gnu.org/licenses/gpl-3.0.en.html) để biết chi tiết.