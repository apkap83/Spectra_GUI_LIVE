package gr.wind.FullStackSpring_Review.excel;

import gr.wind.FullStackSpring_Review.exception.ApiRequestException;
import gr.wind.FullStackSpring_Review.model.AdHocOutageSubscriber;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;

public class ReadExcelFile {

    private static final Logger logger = LogManager.getLogger(ReadExcelFile.class);
    String uploadedFilePath;

    public ReadExcelFile(String uploadedFilePath) {
        this.uploadedFilePath = uploadedFilePath;
    }

    public boolean isAlpha(String name) {
        return name.matches("[a-zA-Z]+");
    }

    public List<AdHocOutageSubscriber> getExcelSubs() throws IOException, ParseException {

        List<String> correctExcelHeaders = Arrays.asList("CliValue", "Start_DateTime", "End_DateTime", "BackupEligible", "Message");
        String fileLocation = uploadedFilePath;
        String excelDateFormat = "EEE MMM dd HH:mm:ss zzzz yyyy";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(excelDateFormat);
//        SimpleDateFormat dateFormat = new SimpleDateFormat(excelDateFormat);
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(excelDateFormat, Locale.ENGLISH);

        FileInputStream file = new FileInputStream(new File(fileLocation));
        Workbook workbook;
        Sheet sheet;
        try {
            workbook = new XSSFWorkbook(file);
            sheet = workbook.getSheetAt(0);
        } catch (Exception e) {
            logger.error("Not a valid excel (xlsx) file");
            throw new ApiRequestException("Not a valid excel (xlsx) file");
        }

        Map<Integer, List<Object>> data = new HashMap<>();
        int i = 0;
        for (Row row : sheet) {
            data.put(i, new ArrayList<Object>());
            for (Cell cell : row) {
                switch (cell.getCellType()) {
                    case STRING:
                        data.get(new Integer(i)).add(cell.getRichStringCellValue().getString());
                        break;
                    case NUMERIC:
                        if (DateUtil.isCellDateFormatted(cell)) {
                            data.get(new Integer(i)).add(cell.getDateCellValue());
                        } else {
                            // Converting Scientific notated number to normal number
                            NumberFormat numericalFormatter = new DecimalFormat("#0");
                            data.get(new Integer(i)).add(String.valueOf(numericalFormatter.format(cell.getNumericCellValue())));
                        }
                    case BOOLEAN:  break;
                    case FORMULA:  break;
                    default: data.get(new Integer(i)).add(cell.getRichStringCellValue().getString());
                }
            }
            i++;
        }

        int headersAtPosition = 0;
        // Get Headers from excel
        List<Object> headers = data.get(headersAtPosition);

        // Compare Headers of Excel with the anticipated headers
        boolean equal = correctExcelHeaders.equals(headers);
        System.out.println("Headers are correct OK");

        if (!equal) {
            logger.error("This excel files does not contain the correct headers: " + correctExcelHeaders.toString());
            throw new ApiRequestException("This excel files does not contain the correct headers: " + correctExcelHeaders.toString());
        };

        List<AdHocOutageSubscriber> adHocSubsList = new ArrayList<>();
        // Iterate
        for (Map.Entry<Integer, List<Object>> entry : data.entrySet()) {
            Integer key = entry.getKey();
            List value = entry.getValue();

            if (key == 0) continue;
            int problematicLineNum = key + 1;

            // Parse only if number of fields are equal to the num of fields of header list
            if (value.size() == correctExcelHeaders.size()) {
                String CliValue;
                String BackupEligible;
                String Message;
                Date StartDate;
                Date EndDate;

                try{
                    StartDate = (Date)value.get(1);
                    EndDate = (Date)value.get(2);
                } catch (Exception e) {

                    logger.error("date in excel file in line: " + problematicLineNum);
                    throw new ApiRequestException("date in excel file in line: " + problematicLineNum);
                }

                try {
                    CliValue = value.get(0).toString();
                    BackupEligible = value.get(3).toString();
                    Message = value.get(4).toString();
                } catch (Exception e) {
                    logger.error("data type in excel file in line: " + problematicLineNum);
                    throw new ApiRequestException("data type in excel file in line: " + problematicLineNum);
                }

                if (!isAlpha(BackupEligible)) {
                    logger.error("data type 2 (BackupEligible) " + BackupEligible  + " in excel file in line: " + problematicLineNum);
                    throw new ApiRequestException("data type 2 (BackupEligible) " + BackupEligible  + " in excel file in line: " + problematicLineNum);
                }

                if (!Pattern.compile("msg[0-9]+").matcher(Message).find()) {
                    logger.error("data type 2 (Message) " + Message + " in excel file in line: " + problematicLineNum);
                    throw new ApiRequestException("data type 2 (Message) " + Message + " in excel file in line: " + problematicLineNum);
                }
                int lineNumber = key;
                adHocSubsList.add(new AdHocOutageSubscriber(lineNumber, CliValue, StartDate, EndDate, BackupEligible, Message));
            }
        }
//        System.out.println(adHocSubsList);
        return adHocSubsList;
    }
}
